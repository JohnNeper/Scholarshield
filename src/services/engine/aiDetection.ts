import { AIDetectionResult, FlaggedAIPassage } from '../../types';

export interface AIDetectionEngineAdapter {
  analyze(text: string): Promise<AIDetectionResult>;
  getStatus(): Promise<{ status: 'healthy' | 'degraded' | 'offline'; version: string; latencyMs: number }>;
  getVersion(): string;
}

export class ClientStylometricAIAdapter implements AIDetectionEngineAdapter {
  private version = 'v2.6.0-multilingual-stylometric';

  getVersion(): string {
    return this.version;
  }

  async getStatus(): Promise<{ status: 'healthy' | 'degraded' | 'offline'; version: string; latencyMs: number }> {
    return {
      status: 'healthy',
      version: this.version,
      latencyMs: 19,
    };
  }

  async analyze(text: string): Promise<AIDetectionResult> {
    const rawSentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const totalWords = text.trim().split(/\s+/).filter(Boolean).length;
    const sentenceLengths = rawSentences.map((s) => s.split(/\s+/).length);

    // 1. Calculate Burstiness (variance & standard deviation of sentence lengths)
    const avgLen =
      sentenceLengths.length > 0
        ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
        : 18;
    const variance =
      sentenceLengths.length > 0
        ? sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / sentenceLengths.length
        : 22;
    const stdDev = Math.sqrt(variance);

    // Burstiness score: high human variation = high burstiness (65-90), low machine variation = low burstiness (20-45)
    const burstinessScore = Math.max(15, Math.min(94, Math.round((stdDev / (avgLen || 1)) * 110)));

    // 2. Vocabulary Richness (Type-Token Ratio / TTR)
    const allWords = text.toLowerCase().match(/\b[a-zA-ZÀ-ÿ]{3,}\b/g) || [];
    const uniqueWords = new Set(allWords);
    const ttr = allWords.length > 0 ? (uniqueWords.size / allWords.length) * 100 : 50;

    // 3. Multilingual AI Formulaic Marker Expressions
    const aiFormulaicMarkers = [
      // French markers
      { pattern: /il convient de noter/i, signal: 'Tournure emphatique convenue', fr: true },
      { pattern: /il est important de souligner/i, signal: 'Marqueur de transition stéréotypé', fr: true },
      { pattern: /joue un rôle (crucial|pivot|déterminant|central)/i, signal: 'Métaphore académique récurrente', fr: true },
      { pattern: /en conclusion, il apparaît/i, signal: 'Clôture rhétorique uniforme', fr: true },
      { pattern: /dans cette optique/i, signal: 'Connecteur logique standardisé', fr: true },
      { pattern: /force est de constater/i, signal: 'Formule assertorie sans nuance', fr: true },
      { pattern: /de surcroît|en outre/i, signal: 'Connecteur additif hautement prévisible', fr: true },
      { pattern: /il est essentiel de (comprendre|garder à l'esprit)/i, signal: 'Injonction didactique passive', fr: true },

      // English markers
      { pattern: /crucial to note/i, signal: 'Overused emphatic modifier', fr: false },
      { pattern: /delves into/i, signal: 'Formulaic academic verb construction', fr: false },
      { pattern: /plays a (crucial|pivotal|key|vital) role/i, signal: 'Standard boilerplate metaphor', fr: false },
      { pattern: /furthermore|moreover/i, signal: 'High syntactic transition predictability', fr: false },
      { pattern: /it is evident that/i, signal: 'Assertive unhedged claim pattern', fr: false },
      { pattern: /in summary|in conclusion/i, signal: 'Predictable summary closure marker', fr: false },
      { pattern: /testament to/i, signal: 'Common generative AI idiom', fr: false },
      { pattern: /a multifaceted/i, signal: 'High-frequency generic descriptor', fr: false },
      { pattern: /it is imperative to/i, signal: 'Imperative formulaic phrase', fr: false },
    ];

    const flaggedPassages: FlaggedAIPassage[] = [];
    let currentOffset = 0;

    rawSentences.forEach((sentence, index) => {
      const matchedSignals: string[] = [];
      const len = sentence.split(/\s+/).length;

      // Check formulaic markers
      for (const marker of aiFormulaicMarkers) {
        if (marker.pattern.test(sentence)) {
          matchedSignals.push(marker.signal);
        }
      }

      // Check syntactic flatness: sentence length extraordinarily close to document average
      if (Math.abs(len - avgLen) <= 2 && len > 12) {
        matchedSignals.push(
          sentence.includes(' et ') || sentence.includes(' de ') || sentence.includes(' que ')
            ? 'Régularité rythmique et faible déviation métrique'
            : 'Uniform sentence length metric'
        );
      }

      // Check low comma/semicolon punctuation density in long sentences
      if (len > 24 && !sentence.includes(',') && !sentence.includes(';')) {
        matchedSignals.push('Syntaxe linéaire continue sans incise');
      }

      if (matchedSignals.length >= 2 || (matchedSignals.length >= 1 && flaggedPassages.length < 3)) {
        // Compute sentence-level probability
        const baseProb = 65 + matchedSignals.length * 9;
        const prob = Math.min(96, Math.max(45, Math.round(baseProb + (100 - burstinessScore) * 0.15)));

        const isFr = /[éèàùçêâôî]/.test(sentence);
        const explanation = isFr
          ? `Indicateurs stylométriques récurrents : ${matchedSignals.join(', ')}. Entropie lexicale basse.`
          : `Stylometric variance aligns with automated generation signatures: ${matchedSignals.join(', ')}.`;

        flaggedPassages.push({
          id: `ai-flag-${index}-${Date.now().toString(36)}`,
          text: sentence,
          offsetStart: currentOffset,
          offsetEnd: currentOffset + sentence.length,
          pageNumber: Math.floor(currentOffset / 2500) + 1,
          aiProbability: prob,
          confidence: prob > 80 ? 'high' : prob > 60 ? 'moderate' : 'low',
          linguisticSignals: Array.from(new Set(matchedSignals)),
          explanation,
        });
      }

      currentOffset += sentence.length + 1;
    });

    // Perplexity estimate (lower = text is more predictable / LLM-like, higher = unique human prose)
    const perplexityEstimate = Math.max(
      22,
      Math.min(92, Math.round(ttr * 0.8 + burstinessScore * 0.35 - flaggedPassages.length * 3))
    );

    // Compute overall probability: blend flagged ratio, burstiness penalty, and perplexity
    const flaggedRatio = rawSentences.length > 0 ? (flaggedPassages.length / rawSentences.length) * 100 : 15;
    const overallAIProbability = Math.min(
      88,
      Math.max(
        6,
        Math.round(
          flaggedRatio * 1.6 +
            (100 - burstinessScore) * 0.25 +
            (100 - perplexityEstimate) * 0.15
        )
      )
    );

    return {
      jobId: `ai-job-${Date.now().toString(36)}`,
      overallAIProbability,
      analyzedWordCount: totalWords || 320,
      flaggedPassagesCount: flaggedPassages.length,
      coveragePercentage: 100,
      burstinessScore,
      perplexityEstimate,
      flaggedPassages,
      modelVersion: this.version,
      evaluationDisclaimer:
        'L’indice probabiliste d’IA est un indicateur exploratoire fondé sur la variance stylométrique, la burstiness et la régularité lexicale. Il ne constitue pas une preuve déterministe. Une révision académique humaine est requise.',
    };
  }
}
