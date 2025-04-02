export async function analyzeTextWithPerspective(
  text: string
): Promise<{ [key: string]: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_PERSPECTIVE_API_KEY;

  try {
    const response = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: { text },
          languages: ["en", "pt"], // Inclua idiomas suportados
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            IDENTITY_ATTACK: {},
            INSULT: {},
            THREAT: {},
            PROFANITY: {},
          },
        }),
      }
    );

    const data = await response.json();

    return {
      TOXICITY: data.attributeScores?.TOXICITY?.summaryScore?.value || 0,
      SEVERE_TOXICITY:
        data.attributeScores?.SEVERE_TOXICITY?.summaryScore?.value || 0,
      IDENTITY_ATTACK:
        data.attributeScores?.IDENTITY_ATTACK?.summaryScore?.value || 0,
      INSULT: data.attributeScores?.INSULT?.summaryScore?.value || 0,
      THREAT: data.attributeScores?.THREAT?.summaryScore?.value || 0,
      PROFANITY: data.attributeScores?.PROFANITY?.summaryScore?.value || 0,
    };
  } catch (error) {
    console.error("Error analyzing text:", error);
    return null;
  }
}
