import React, { useState, useEffect } from 'react';

const ComplexityCalculator = () => {
  const [code, setCode] = useState('');
  const [complexity, setComplexity] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [bigO, setBigO] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  const [metrics, setMetrics] = useState({});
  const [detailedBigO, setDetailedBigO] = useState(null);
  const [optimizations, setOptimizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const [language, setLanguage] = useState('javascript');
  const [history, setHistory] = useState([]);

  const calculateComplexity = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      
      setComplexity(data.complexity);
      setAnalysis(data.analysis);
      setSuggestions(data.suggestions || []);
      setBigO(data.bigO || 'O(1)');
      setTimeComplexity(data.timeComplexity || 'O(1)');
      setSpaceComplexity(data.spaceComplexity || 'O(1)');
      setMetrics(data.metrics || {});
      
      // Add to history
      setHistory(prev => [
        { 
          timestamp: new Date().toLocaleTimeString(),
          complexity: data.complexity,
          bigO: data.bigO,
          codeSnippet: code.substring(0, 50) + '...' 
        },
        ...prev.slice(0, 4)
      ]);
      
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('Failed to analyze code. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeBigO = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bigO-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      setDetailedBigO(data);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOptimizations = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      setOptimizations(data);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = () => {
    if (!complexity) return 'low';
    if (complexity < 30) return 'low';
    if (complexity < 70) return 'medium';
    return 'high';
  };

  const getBigOColor = (bigONotation) => {
    if (!bigONotation) return 'low';
    if (bigONotation.includes('O(1)') || bigONotation.includes('O(log')) return 'low';
    if (bigONotation.includes('O(n)')) return 'medium';
    if (bigONotation.includes('O(n²)') || bigONotation.includes('O(n^2)') || bigONotation.includes('O(2^n)')) return 'high';
    return 'medium';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.gradientText}>CodeComplexity.AI</span>
          <span style={styles.pulseDot}></span>
        </h1>
        <p style={styles.subtitle}>Advanced BigO & Complexity Analysis</p>
      </div>

      <div style={styles.main}>
        <div style={styles.codeInputSection}>
          <div style={styles.toolbar}>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.languageSelector}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
            </select>
            
            <div style={styles.buttonGroup}>
              <button 
                onClick={calculateComplexity}
                disabled={loading}
                style={{...styles.analyzeBtn, ...(loading ? styles.loading : {})}}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    ANALYZING...
                  </>
                ) : (
                  '🔍 ANALYZE'
                )}
              </button>
              
              <button 
                onClick={analyzeBigO}
                disabled={loading}
                style={{...styles.bigOBtn, ...(loading ? styles.loading : {})}}
              >
                📊 BigO
              </button>
              
              <button 
                onClick={getOptimizations}
                disabled={loading}
                style={{...styles.optimizeBtn, ...(loading ? styles.loading : {})}}
              >
                ⚡ OPTIMIZE
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Enter your ${language} code here...`}
            style={styles.codeEditor}
          />
        </div>

        <div style={styles.resultsPanel}>
          {complexity !== null && (
            <div style={styles.metricsGrid}>
              <div style={{...styles.metricCard, ...styles[getComplexityColor()]}}>
                <div style={styles.metricValue}>{complexity}</div>
                <div style={styles.metricLabel}>COMPLEXITY</div>
              </div>
              
              <div style={{...styles.metricCard, ...styles[getBigOColor(bigO)]}}>
                <div style={styles.metricValue}>{bigO}</div>
                <div style={styles.metricLabel}>BIG O</div>
              </div>
              
              <div style={{...styles.metricCard, ...styles[getBigOColor(timeComplexity)]}}>
                <div style={styles.metricValue}>{timeComplexity}</div>
                <div style={styles.metricLabel}>TIME</div>
              </div>
              
              <div style={{...styles.metricCard, ...styles[getBigOColor(spaceComplexity)]}}>
                <div style={styles.metricValue}>{spaceComplexity}</div>
                <div style={styles.metricLabel}>SPACE</div>
              </div>
            </div>
          )}

          <div style={styles.resultsTabs}>
            <button 
              style={{...styles.tab, ...(activeTab === 'analysis' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('analysis')}
            >
              📋 Analysis
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'bigO' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('bigO')}
            >
              📊 BigO Details
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'suggestions' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('suggestions')}
            >
              💡 Suggestions
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'metrics' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('metrics')}
            >
              📈 Metrics
            </button>
            <button 
              style={{...styles.tab, ...(activeTab === 'history' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('history')}
            >
              🕒 History
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'analysis' && analysis && (
              <div style={styles.analysisContent}>
                <h3 style={styles.sectionTitle}>CODE ANALYSIS</h3>
                <p style={styles.analysisText}>{analysis}</p>
              </div>
            )}

            {activeTab === 'bigO' && detailedBigO && (
              <div style={styles.bigOContent}>
                <h3 style={styles.sectionTitle}>DETAILED BIG O ANALYSIS</h3>
                <div style={styles.bigOGrid}>
                  <div style={styles.bigOSection}>
                    <h4>Time Complexity: {detailedBigO.overallTimeComplexity}</h4>
                    <h4>Space Complexity: {detailedBigO.overallSpaceComplexity}</h4>
                  </div>
                  <div style={styles.scenariosSection}>
                    <h4>Scenarios:</h4>
                    <p>Best: {detailedBigO.scenarios?.bestCase}</p>
                    <p>Average: {detailedBigO.scenarios?.averageCase}</p>
                    <p>Worst: {detailedBigO.scenarios?.worstCase}</p>
                  </div>
                </div>
                <p style={styles.explanation}>{detailedBigO.explanation}</p>
                {detailedBigO.bottlenecks && detailedBigO.bottlenecks.length > 0 && (
                  <div style={styles.bottlenecks}>
                    <h4>Performance Bottlenecks:</h4>
                    <ul>
                      {detailedBigO.bottlenecks.map((bottleneck, index) => (
                        <li key={index}>{bottleneck}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div style={styles.suggestionsContent}>
                <h3 style={styles.sectionTitle}>OPTIMIZATION SUGGESTIONS</h3>
                {optimizations ? (
                  <div style={styles.optimizationSections}>
                    {optimizations.improvements && optimizations.improvements.length > 0 && (
                      <div style={styles.optimizationSection}>
                        <h4>🔧 Code Improvements</h4>
                        <ul>
                          {optimizations.improvements.map((item, index) => (
                            <li key={index} style={styles.suggestionItem}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {optimizations.performanceOptimizations && optimizations.performanceOptimizations.length > 0 && (
                      <div style={styles.optimizationSection}>
                        <h4>⚡ Performance Optimizations</h4>
                        <ul>
                          {optimizations.performanceOptimizations.map((item, index) => (
                            <li key={index} style={styles.suggestionItem}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {optimizations.algorithmSuggestions && optimizations.algorithmSuggestions.length > 0 && (
                      <div style={styles.optimizationSection}>
                        <h4>🧠 Algorithm Improvements</h4>
                        <ul>
                          {optimizations.algorithmSuggestions.map((item, index) => (
                            <li key={index} style={styles.suggestionItem}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {suggestions.length > 0 ? (
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <li key={index} style={styles.suggestionItem}>
                            <span style={styles.suggestionBadge}>{index + 1}</span>
                            {typeof suggestion === 'string' ? suggestion : JSON.stringify(suggestion)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Click "OPTIMIZE" for detailed suggestions</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && metrics && Object.keys(metrics).length > 0 && (
              <div style={styles.metricsContent}>
                <h3 style={styles.sectionTitle}>CODE METRICS</h3>
                <div style={styles.metricsDetailGrid}>
                  <div style={styles.metricDetailCard}>
                    <div style={styles.metricDetailValue}>{metrics.cyclomaticComplexity}</div>
                    <div style={styles.metricDetailLabel}>Cyclomatic Complexity</div>
                  </div>
                  <div style={styles.metricDetailCard}>
                    <div style={styles.metricDetailValue}>{metrics.cognitiveComplexity}</div>
                    <div style={styles.metricDetailLabel}>Cognitive Complexity</div>
                  </div>
                  <div style={styles.metricDetailCard}>
                    <div style={styles.metricDetailValue}>{metrics.maintainabilityIndex}</div>
                    <div style={styles.metricDetailLabel}>Maintainability Index</div>
                  </div>
                  <div style={styles.metricDetailCard}>
                    <div style={styles.metricDetailValue}>{metrics.linesOfCode}</div>
                    <div style={styles.metricDetailLabel}>Lines of Code</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && history.length > 0 && (
              <div style={styles.historyContent}>
                <h3 style={styles.sectionTitle}>ANALYSIS HISTORY</h3>
                <div style={styles.historyItems}>
                  {history.map((item, index) => (
                    <div key={index} style={styles.historyItem}>
                      <span style={styles.historyTime}>{item.timestamp}</span>
                      <span style={{...styles.historyScore, ...styles[item.complexity < 30 ? 'low' : item.complexity < 70 ? 'medium' : 'high']}}>
                        {item.complexity}
                      </span>
                      <span style={styles.historyBigO}>{item.bigO}</span>
                      <span style={styles.historySnippet}>{item.codeSnippet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#ffffff',
    fontFamily: "'Fira Code', 'Courier New', monospace",
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  gradientText: {
    background: 'linear-gradient(45deg, #00f5ff, #ff00ff, #00ff00)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'gradientShift 3s ease infinite',
  },
  pulseDot: {
    width: '12px',
    height: '12px',
    background: '#00ff00',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    boxShadow: '0 0 20px #00ff00',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#888',
    fontWeight: '300',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  codeInputSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '15px',
  },
  languageSelector: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '10px 15px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  analyzeBtn: {
    background: 'linear-gradient(45deg, #00f5ff, #0066ff)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(0, 245, 255, 0.3)',
  },
  bigOBtn: {
    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(255, 107, 107, 0.3)',
  },
  optimizeBtn: {
    background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(0, 255, 136, 0.3)',
  },
  loading: {
    opacity: '0.6',
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  codeEditor: {
    width: '100%',
    height: '400px',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '20px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: "'Fira Code', monospace",
    lineHeight: '1.6',
    resize: 'vertical',
    outline: 'none',
  },
  resultsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    marginBottom: '30px',
  },
  metricCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '5px',
  },
  metricLabel: {
    fontSize: '0.85rem',
    opacity: '0.8',
    fontWeight: '500',
  },
  low: {
    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1))',
    borderColor: '#00ff88',
    boxShadow: '0 10px 30px rgba(0, 255, 136, 0.2)',
  },
  medium: {
    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))',
    borderColor: '#ffc107',
    boxShadow: '0 10px 30px rgba(255, 193, 7, 0.2)',
  },
  high: {
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1))',
    borderColor: '#ff6b6b',
    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.2)',
  },
  resultsTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  tab: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    background: 'linear-gradient(45deg, #00f5ff, #0066ff)',
    borderColor: '#00f5ff',
    boxShadow: '0 5px 15px rgba(0, 245, 255, 0.3)',
  },
  tabContent: {
    minHeight: '300px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#00f5ff',
    textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
  },
  analysisContent: {
    lineHeight: '1.8',
  },
  analysisText: {
    fontSize: '1rem',
    color: '#e0e0e0',
    lineHeight: '1.7',
  },
  bigOContent: {
    lineHeight: '1.6',
  },
  bigOGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  bigOSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  scenariosSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  explanation: {
    fontSize: '1rem',
    color: '#e0e0e0',
    lineHeight: '1.7',
    marginBottom: '15px',
  },
  bottlenecks: {
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '10px',
    padding: '15px',
    border: '1px solid rgba(255, 107, 107, 0.3)',
  },
  suggestionsContent: {
    lineHeight: '1.6',
  },
  optimizationSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  optimizationSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  suggestionItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '15px',
    margin: '10px 0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  suggestionBadge: {
    background: 'linear-gradient(45deg, #00f5ff, #0066ff)',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  metricsContent: {
    lineHeight: '1.6',
  },
  metricsDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  metricDetailCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '25px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  metricDetailValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '10px',
    color: '#00f5ff',
  },
  metricDetailLabel: {
    fontSize: '1rem',
    opacity: '0.8',
    fontWeight: '500',
  },
  historyContent: {
    lineHeight: '1.6',
  },
  historyItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  historyItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'grid',
    gridTemplateColumns: 'auto auto auto 1fr',
    gap: '20px',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: '0.9rem',
    color: '#888',
    fontWeight: '500',
  },
  historyScore: {
    fontSize: '1.2rem',
    fontWeight: '700',
    padding: '5px 12px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '50px',
  },
  historyBigO: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#00f5ff',
    background: 'rgba(0, 245, 255, 0.1)',
    padding: '5px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 245, 255, 0.3)',
  },
  historySnippet: {
    fontSize: '0.9rem',
    color: '#ccc',
    fontFamily: "'Fira Code', monospace",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

// Add CSS animations via style tag
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 1200px) {
    .main { grid-template-columns: 1fr !important; }
  }
  
  @media (max-width: 768px) {
    .metricsGrid { grid-template-columns: repeat(2, 1fr) !important; }
    .bigOGrid { grid-template-columns: 1fr !important; }
    .metricsDetailGrid { grid-template-columns: 1fr !important; }
    .historyItem { grid-template-columns: 1fr !important; text-align: center; }
  }
`;
document.head.appendChild(styleTag);

export default ComplexityCalculator