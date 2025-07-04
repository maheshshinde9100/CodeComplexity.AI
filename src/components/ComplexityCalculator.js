// /src/componenents/ComplexityCalculator.js

import React, { useState } from 'react';

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
      const response = await fetch('/api/calculate', {
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
      const response = await fetch('/api/bigO-analysis', {
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
      const response = await fetch('/api/optimize', {
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
    padding: 'clamp(15px, 5vw, 40px)',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'clamp(20px, 5vw, 40px)',
    padding: 'clamp(15px, 3vw, 20px) 0',
  },
  title: {
    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
    fontWeight: '800',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(8px, 2vw, 15px)',
    lineHeight: '1.2',
    flexWrap: 'wrap',
  },
  gradientText: {
    background: 'linear-gradient(45deg, #00f5ff, #ff00ff, #00ff00)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'gradientShift 3s ease infinite',
  },
  pulseDot: {
    width: 'clamp(10px, 2vw, 12px)',
    height: 'clamp(10px, 2vw, 12px)',
    background: '#00ff00',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
    boxShadow: '0 0 20px #00ff00',
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
    color: '#888',
    fontWeight: '300',
    maxWidth: '600px',
    margin: '0 auto',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 'clamp(20px, 4vw, 30px)',
    maxWidth: '1600px',
    margin: '0 auto',
    width: '100%',
  },
  codeInputSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'clamp(15px, 3vw, 20px)',
    padding: 'clamp(20px, 4vw, 25px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    width: '100%',
    boxSizing: 'border-box',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(15px, 3vw, 20px)',
    gap: '15px',
    flexWrap: 'wrap',
  },
  languageSelector: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 15px)',
    color: '#ffffff',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    cursor: 'pointer',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '120px',
  },
  buttonGroup: {
    display: 'flex',
    gap: 'clamp(8px, 2vw, 10px)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  analyzeBtn: {
    background: 'linear-gradient(45deg, #00f5ff, #0066ff)',
    border: 'none',
    borderRadius: '12px',
    padding: 'clamp(10px, 2vw, 12px) clamp(18px, 4vw, 24px)',
    color: '#ffffff',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(0, 245, 255, 0.3)',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: '100px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  bigOBtn: {
    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
    border: 'none',
    borderRadius: '12px',
    padding: 'clamp(10px, 2vw, 12px) clamp(18px, 4vw, 20px)',
    color: '#ffffff',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(255, 107, 107, 0.3)',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: '100px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  optimizeBtn: {
    background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
    border: 'none',
    borderRadius: '12px',
    padding: 'clamp(10px, 2vw, 12px) clamp(18px, 4vw, 20px)',
    color: '#ffffff',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px rgba(0, 255, 136, 0.3)',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: '100px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  loading: {
    opacity: '0.6',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
    flexShrink: 0,
  },
  codeEditor: {
    width: '100%',
    height: 'clamp(250px, 50vh, 400px)',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: 'clamp(15px, 3vw, 20px)',
    color: '#ffffff',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontFamily: "'Fira Code', monospace",
    lineHeight: '1.6',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  resultsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'clamp(15px, 3vw, 20px)',
    padding: 'clamp(20px, 4vw, 25px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    width: '100%',
    boxSizing: 'border-box',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'clamp(10px, 3vw, 15px)',
    marginBottom: 'clamp(20px, 4vw, 30px)',
  },
  metricCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: 'clamp(15px, 3vw, 20px)',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    fontWeight: '800',
    marginBottom: '5px',
    lineHeight: '1.2',
  },
  metricLabel: {
    fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
    opacity: '0.8',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: '1.3',
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
    gap: 'clamp(8px, 2vw, 10px)',
    marginBottom: 'clamp(20px, 4vw, 25px)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tab: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: 'clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)',
    color: '#ffffff',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '80px',
    textAlign: 'center',
  },
  activeTab: {
    background: 'linear-gradient(45deg, #00f5ff, #0066ff)',
    borderColor: '#00f5ff',
    boxShadow: '0 5px 15px rgba(0, 245, 255, 0.3)',
  },
  tabContent: {
    minHeight: 'clamp(250px, 40vh, 300px)',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: 'clamp(20px, 4vw, 25px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
  },
  sectionTitle: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    fontWeight: '700',
    marginBottom: 'clamp(15px, 3vw, 20px)',
    color: '#00f5ff',
    textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
    lineHeight: '1.3',
  },
  analysisContent: {
    lineHeight: '1.8',
  },
  analysisText: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    color: '#e0e0e0',
    lineHeight: '1.7',
    marginBottom: '15px',
  },
  bigOContent: {
    lineHeight: '1.6',
  },
  bigOGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(15px, 3vw, 20px)',
    marginBottom: 'clamp(15px, 3vw, 20px)',
  },
  bigOSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: 'clamp(12px, 3vw, 15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
  },
  scenariosSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: 'clamp(12px, 3vw, 15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
  },
  explanation: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    color: '#e0e0e0',
    lineHeight: '1.7',
    marginBottom: '15px',
  },
  bottlenecks: {
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '10px',
    padding: 'clamp(12px, 3vw, 15px)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    boxSizing: 'border-box',
  },
  suggestionsContent: {
    lineHeight: '1.6',
  },
  optimizationSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(15px, 3vw, 20px)',
  },
  optimizationSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: 'clamp(15px, 3vw, 20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxSizing: 'border-box',
  },
  suggestionItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: 'clamp(12px, 3vw, 15px)',
    margin: '10px 0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'clamp(10px, 2vw, 15px)',
    boxSizing: 'border-box',
  },
  suggestionBadge: {
    background: 'linear-gradient(45deg, #00f5ff, #0066ff)',
    borderRadius: '50%',
    width: 'clamp(28px, 5vw, 30px)',
    height: 'clamp(28px, 5vw, 30px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '600',
    flexShrink: 0,
    color: '#ffffff',
  },
  suggestionText: {
    flex: 1,
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    color: '#e0e0e0',
    lineHeight: '1.6',
  },
  metricsContent: {
    lineHeight: '1.6',
  },
  metricsDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'clamp(15px, 3vw, 20px)',
  },
  metricDetailCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: 'clamp(20px, 4vw, 25px)',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '120px',
  },
  metricDetailValue: {
    fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
    fontWeight: '800',
    marginBottom: '10px',
    color: '#00f5ff',
    lineHeight: '1.2',
  },
  metricDetailLabel: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    opacity: '0.8',
    fontWeight: '500',
    lineHeight: '1.3',
    textAlign: 'center',
  },
  historyContent: {
    lineHeight: '1.6',
  },
  historyItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 3vw, 15px)',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '10px',
  },
  historyItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: 'clamp(15px, 3vw, 20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 'clamp(10px, 2vw, 15px)',
    alignItems: 'center',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  },
  historyTime: {
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
  historyScore: {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    fontWeight: '700',
    padding: '5px 12px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '50px',
    alignSelf: 'center',
  },
  historyBigO: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    fontWeight: '600',
    color: '#00f5ff',
    background: 'rgba(0, 245, 255, 0.1)',
    padding: '5px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 245, 255, 0.3)',
    textAlign: 'center',
    alignSelf: 'center',
  },
  historySnippet: {
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    color: '#ccc',
    fontFamily: "'Fira Code', monospace",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    padding: '5px 0',
  },
};

// Add CSS animations via style tag with enhanced responsive design
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
  
  /* Enhanced responsive breakpoints */
  @media (min-width: 768px) {
    .main { 
      grid-template-columns: 1fr !important; 
    }
    
    .toolbar {
      flex-wrap: nowrap !important;
      justify-content: space-between !important;
    }
    
    .buttonGroup {
      flex-wrap: nowrap !important;
    }
    
    .resultsTabs {
      justify-content: flex-start !important;
    }
    
    .historyItem {
      grid-template-columns: auto auto auto 1fr !important;
      text-align: left !important;
    }
    
    .historyTime,
    .historyScore,
    .historyBigO,
    .historySnippet {
      text-align: left !important;
    }
  }
  
  @media (min-width: 1024px) {
    .main { 
      grid-template-columns: 1fr 1fr !important; 
    }
    
    .metricsGrid { 
      grid-template-columns: repeat(4, 1fr) !important; 
    }
    
    .bigOGrid { 
      grid-template-columns: 1fr 1fr !important; 
    }
    
    .metricsDetailGrid { 
      grid-template-columns: repeat(2, 1fr) !important; 
    }
  }
  
  /* Mobile-first responsive design */
  @media (max-width: 767px) {
    .toolbar {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .buttonGroup {
      justify-content: stretch !important;
    }
    
    .buttonGroup > button {
      flex: 1 !important;
    }
    
    .languageSelector {
      width: 100% !important;
      justify-content: center !important;
    }
    
    .metricsGrid { 
      grid-template-columns: repeat(2, 1fr) !important; 
    }
    
    .bigOGrid { 
      grid-template-columns: 1fr !important; 
    }
    
    .metricsDetailGrid { 
      grid-template-columns: 1fr !important; 
    }
    
    .historyItem { 
      grid-template-columns: 1fr !important; 
      text-align: center !important; 
      gap: 8px !important;
    }
    
    .resultsTabs {
      justify-content: center !important;
    }
    
    .tab {
      flex: 1 !important;
      min-width: 80px !important;
    }
    
    .suggestionItem {
      flex-direction: column !important;
      text-align: center !important;
      align-items: center !important;
    }
    
    .suggestionBadge {
      margin-bottom: 8px !important;
    }
  }
  
  /* Extra small devices */
  @media (max-width: 480px) {
    .metricsGrid { 
      grid-template-columns: 1fr !important; 
    }
    
    .resultsTabs {
      flex-direction: column !important;
    }
    
    .tab {
      width: 100% !important;
    }
    
    .title {
      flex-direction: column !important;
      gap: 10px !important;
    }
  }
  
  /* Very small devices */
  @media (max-width: 360px) {
    .buttonGroup {
      flex-direction: column !important;
      gap: 8px !important;
    }
    
    .toolbar {
      gap: 10px !important;
    }
  }
  
  /* Landscape orientation for mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    .title {
      font-size: 1.8rem !important;
    }
    
    .codeEditor {
      height: 200px !important;
    }
    
    .tabContent {
      min-height: 200px !important;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .tab,
    .analyzeBtn,
    .bigOBtn,
    .optimizeBtn,
    .languageSelector {
      min-height: 48px !important;
    }
  }
  
  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .pulseDot {
      box-shadow: 0 0 15px #00ff00 !important;
    }
  }
  
  /* Accessibility - Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .container {
      background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%) !important;
    }
  }
  
  /* Print styles */
  @media print {
    .container {
      background: white !important;
      color: black !important;
    }
    
    .analyzeBtn,
    .bigOBtn,
    .optimizeBtn {
      display: none !important;
    }
    
    .codeEditor {
      border: 1px solid #ccc !important;
      background: white !important;
      color: black !important;
    }
  }
  
  /* Scrollbar styling for webkit browsers */
  .historyItems::-webkit-scrollbar {
    width: 8px;
  }
  
  .historyItems::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  .historyItems::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #00f5ff, #0066ff);
    border-radius: 4px;
  }
  
  .historyItems::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #0066ff, #00f5ff);
  }
`;

// Only append if not already present
if (!document.getElementById('complexity-calculator-styles')) {
  styleTag.id = 'complexity-calculator-styles';
  document.head.appendChild(styleTag);
}

export default ComplexityCalculator;