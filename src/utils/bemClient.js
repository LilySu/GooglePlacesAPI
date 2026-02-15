export const analyzeBiomarkersWithBem = async (rawText) => {
  const response = await fetch('https://api.bem.ai/v1/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_BEM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: rawText,
      // We instruct bem.ai exactly what to look for based on your PDF's rows
      instruction: `
        Analyze this biomarker report. 
        Compare 'Session 1' to 'Session 12'.
        Return a JSON object with:
        1. grip_drop: boolean (true if 'Downward dog hold' fell >= 10%)
        2. core_drop: boolean (true if 'Plank hold' fell >= 5%)
        3. balance_drop: boolean (true if 'Single leg stand L' fell >= 5%)
        4. percent_changes: { grip, core, balance }
      `,
    })
  });
  return await response.json();
};