const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(bodyParser.json());

// Helper function to get model
function getModel() {
  try {
    // PRIMARY CHOICE: Use the stable, free Gemini 2.5 Flash model
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  } catch (error) {
    console.error("Error with gemini-2.5-flash:", error.message);
    // FALLBACK: Try the Flash-Lite model if the primary fails
    try {
      console.log("Falling back to gemini-2.5-flash-lite...");
      return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    } catch (error2) {
      // FINAL FALLBACK: Try a preview model
      console.error("Error with fallback model:", error2.message);
      console.log("Trying preview model...");
      return genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    }
  }
}

app.post('/api/calculate', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const complexityAnalysis = await analyzeCodeWithGemini(code, language);
    
    const suggestions = Array.isArray(complexityAnalysis.suggestions) 
      ? complexityAnalysis.suggestions 
      : [complexityAnalysis.suggestions || 'No suggestions provided'];
    
    res.json({ 
      complexity: complexityAnalysis.complexityScore || 0,
      analysis: complexityAnalysis.analysis || 'No analysis available',
      suggestions: suggestions,
      bigO: complexityAnalysis.bigO || 'O(1)',
      timeComplexity: complexityAnalysis.timeComplexity || 'O(1)',
      spaceComplexity: complexityAnalysis.spaceComplexity || 'O(1)',
      metrics: complexityAnalysis.metrics || {
        cyclomaticComplexity: 1,
        cognitiveComplexity: 1,
        maintainabilityIndex: 100,
        linesOfCode: code.split('\n').length
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code',
      details: error.message 
    });
  }
});

app.post('/api/bigO-analysis', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const bigOAnalysis = await analyzeBigOWithGemini(code, language);
    
    res.json(bigOAnalysis);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze BigO complexity',
      details: error.message 
    });
  }
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const optimizations = await getOptimizationSuggestions(code, language);
    
    res.json(optimizations);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get optimization suggestions',
      details: error.message 
    });
  }
});

// Enhanced code analysis with BigO notation
async function analyzeCodeWithGemini(code, language) {
  try {
    // Use the helper function to get the best available model
    const model = getModel();

    const prompt = `
    Analyze the following ${language} code comprehensively and provide:
    1. A complexity score between 1-100 (1 being simplest, 100 being most complex)
    2. Detailed analysis of complexity factors
    3. Specific optimization suggestions (provide as an array)
    4. BigO notation for overall complexity
    5. Time complexity in BigO notation
    6. Space complexity in BigO notation
    7. Code metrics including cyclomatic complexity, cognitive complexity, maintainability index
    
    The code:
    ${code}
    
    Respond in this exact JSON format:
    {
      "complexityScore": 0,
      "analysis": "",
      "suggestions": [],
      "bigO": "O(1)",
      "timeComplexity": "O(1)",
      "spaceComplexity": "O(1)",
      "metrics": {
        "cyclomaticComplexity": 1,
        "cognitiveComplexity": 1,
        "maintainabilityIndex": 100,
        "linesOfCode": 1
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Gemini API error:', e);
    return {
      complexityScore: 0,
      analysis: "Analysis failed due to API error: " + e.message,
      suggestions: ["Could not generate suggestions"],
      bigO: "O(1)",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      metrics: {
        cyclomaticComplexity: 1,
        cognitiveComplexity: 1,
        maintainabilityIndex: 100,
        linesOfCode: code.split('\n').length
      }
    };
  }
}

async function analyzeBigOWithGemini(code, language) {
  try {
    const model = getModel();

    const prompt = `
    Provide a detailed BigO notation analysis for the following ${language} code:
    
    ${code}
    
    Analyze and explain:
    1. Overall time complexity with explanation
    2. Space complexity with explanation
    3. Best, average, and worst case scenarios
    4. Detailed breakdown of each function/method
    5. Performance characteristics and bottlenecks
    
    Respond in this JSON format:
    {
      "overallTimeComplexity": "O(1)",
      "overallSpaceComplexity": "O(1)",
      "detailedBreakdown": [],
      "scenarios": {
        "bestCase": "O(1)",
        "averageCase": "O(1)",
        "worstCase": "O(1)"
      },
      "explanation": "",
      "bottlenecks": []
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Gemini API error:', e);
    return {
      overallTimeComplexity: "O(1)",
      overallSpaceComplexity: "O(1)",
      detailedBreakdown: [],
      scenarios: {
        bestCase: "O(1)",
        averageCase: "O(1)",
        worstCase: "O(1)"
      },
      explanation: "Analysis failed due to API error: " + e.message,
      bottlenecks: []
    };
  }
}

async function getOptimizationSuggestions(code, language) {
  try {
    const model = getModel();

    const prompt = `
    Provide detailed optimization suggestions for the following ${language} code:
    
    ${code}
    
    Provide:
    1. Specific code improvements with before/after examples
    2. Performance optimizations
    3. Memory usage optimizations
    4. Algorithm improvements
    5. Best practices recommendations
    
    Respond in this JSON format:
    {
      "improvements": [],
      "performanceOptimizations": [],
      "memoryOptimizations": [],
      "algorithmSuggestions": [],
      "bestPractices": []
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Gemini API error:', e);
    return {
      improvements: ["Could not generate improvements"],
      performanceOptimizations: ["Could not generate performance optimizations"],
      memoryOptimizations: ["Could not generate memory optimizations"],
      algorithmSuggestions: ["Could not generate algorithm suggestions"],
      bestPractices: ["Could not generate best practices"]
    };
  }
}

module.exports = app;