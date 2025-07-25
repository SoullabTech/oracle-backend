import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ElementalAlchemyHoloflower, HoloflowerHouse, ConsciousnessLevel, AlchemicalProcess } from '../core/ElementalAlchemyHoloflower';
import { motion, AnimatePresence } from 'framer-motion';

interface ElementalAlchemyVisualizationProps {
  userId?: string;
  onHouseClick?: (house: HoloflowerHouse) => void;
  onTransformation?: (from: number, to: number) => void;
  showLabels?: boolean;
  interactive?: boolean;
}

export const ElementalAlchemyVisualization: React.FC<ElementalAlchemyVisualizationProps> = ({
  userId,
  onHouseClick,
  onTransformation,
  showLabels = true,
  interactive = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [holoflower] = useState(() => new ElementalAlchemyHoloflower());
  const [state, setState] = useState(holoflower.getState());
  const [selectedHouse, setSelectedHouse] = useState<HoloflowerHouse | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<HoloflowerHouse | null>(null);
  const [dragStart, setDragStart] = useState<HoloflowerHouse | null>(null);
  const [showConsciousnessRings, setShowConsciousnessRings] = useState(true);
  const [showAlchemicalOverlay, setShowAlchemicalOverlay] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const width = 900;
  const height = 900;
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = 250;

  // Update state when holoflower changes
  useEffect(() => {
    const interval = setInterval(() => {
      setState(holoflower.getState());
    }, 100);
    return () => clearInterval(interval);
  }, [holoflower]);

  // Consciousness level colors
  const consciousnessColors: Record<ConsciousnessLevel, string> = {
    'meta-conscious': '#FFD700', // Gold
    'conscious': '#87CEEB', // Sky blue
    'subconscious': '#9370DB', // Medium purple
    'unconscious': '#483D8B' // Dark slate blue
  };

  // Alchemical process patterns
  const alchemicalPatterns: Record<AlchemicalProcess, string> = {
    'sublimatio': 'ascending-pattern', // Upward arrows
    'calcinatio': 'fire-pattern', // Flame shapes
    'coagulatio': 'crystal-pattern', // Crystalline structure
    'solutio': 'wave-pattern' // Flowing waves
  };

  const renderHouse = (house: HoloflowerHouse) => {
    const visualData = holoflower.exportVisualizationData();
    const houseVis = visualData.houses.find(h => h.number === house.number)!;
    
    const isSelected = selectedHouse?.number === house.number;
    const isHovered = hoveredHouse?.number === house.number;
    
    return (
      <motion.g
        key={house.number}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isSelected ? 1.15 : (isHovered ? 1.08 : 1),
          opacity: 1 
        }}
        transition={{ 
          duration: 0.3 * animationSpeed,
          type: "spring"
        }}
      >
        {/* Alchemical process background */}
        {showAlchemicalOverlay && (
          <circle
            cx={centerX + houseVis.x}
            cy={centerY + houseVis.y}
            r={houseVis.size * 1.8}
            fill={`url(#${alchemicalPatterns[house.alchemicalProcess]})`}
            opacity={0.2}
          />
        )}
        
        {/* Consciousness level ring */}
        {showConsciousnessRings && (
          <motion.circle
            cx={centerX + houseVis.x}
            cy={centerY + houseVis.y}
            r={houseVis.size * 1.4}
            fill="none"
            stroke={consciousnessColors[house.consciousnessLevel]}
            strokeWidth={3}
            strokeDasharray="5,3"
            opacity={0.6}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 20 / animationSpeed, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        )}
        
        {/* Main house circle */}
        <motion.circle
          cx={centerX + houseVis.x}
          cy={centerY + houseVis.y}
          r={houseVis.size}
          fill={house.color}
          fillOpacity={house.currentIntensity}
          stroke={isSelected ? '#FFD700' : (isHovered ? '#FFFFFF' : house.color)}
          strokeWidth={isSelected ? 4 : (isHovered ? 3 : 2)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onMouseEnter={() => interactive && setHoveredHouse(house)}
          onMouseLeave={() => interactive && setHoveredHouse(null)}
          onClick={() => interactive && handleHouseClick(house)}
          onMouseDown={() => interactive && setDragStart(house)}
          whileHover={interactive ? { scale: 1.05 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
        />
        
        {/* House number */}
        <text
          x={centerX + houseVis.x}
          y={centerY + houseVis.y - 5}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          fontSize="18"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {house.number}
        </text>
        
        {/* Sacred symbol */}
        <text
          x={centerX + houseVis.x}
          y={centerY + houseVis.y + 15}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="20"
          style={{ pointerEvents: 'none' }}
        >
          {house.sacredSymbol}
        </text>
        
        {/* Transformation glow */}
        {houseVis.glowIntensity > 0.5 && (
          <motion.circle
            cx={centerX + houseVis.x}
            cy={centerY + houseVis.y}
            r={houseVis.size}
            fill="none"
            stroke="#FFD700"
            strokeWidth={2}
            opacity={houseVis.glowIntensity * 0.5}
            animate={{ 
              r: [houseVis.size, houseVis.size * 1.3, houseVis.size],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ 
              duration: 2 / animationSpeed, 
              repeat: Infinity 
            }}
          />
        )}
      </motion.g>
    );
  };

  const renderCenterSpiral = () => {
    const visualData = holoflower.exportVisualizationData();
    const spiralPoints = visualData.spiral.points;
    
    const pathData = spiralPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${centerX + point.x} ${centerY + point.y}`)
      .join(' ');
    
    return (
      <motion.g>
        {/* Phi ratio sacred geometry */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#spiralGradient)"
          strokeWidth={2}
          opacity={state.centerSpiral.integration}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 60 / animationSpeed, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Center integration circle */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={40}
          fill="url(#centerGradient)"
          fillOpacity={0.3}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3 / animationSpeed, 
            repeat: Infinity 
          }}
        />
        
        {/* Integration percentage */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="#FFD700"
          fontSize="16"
          fontWeight="bold"
        >
          {Math.round(state.centerSpiral.integration * 100)}%
        </text>
        
        {/* Phi symbol */}
        <text
          x={centerX}
          y={centerY + 20}
          textAnchor="middle"
          fill="#FFD700"
          fontSize="24"
          fontFamily="serif"
        >
          φ
        </text>
      </motion.g>
    );
  };

  const renderQuadrantBackgrounds = () => {
    return state.quadrants.map((quadrant, index) => {
      const startAngle = index * 90 - 90;
      const endAngle = startAngle + 90;
      
      const startRad = startAngle * Math.PI / 180;
      const endRad = endAngle * Math.PI / 180;
      
      const largeArcFlag = 0;
      const x1 = centerX + Math.cos(startRad) * baseRadius * 1.5;
      const y1 = centerY + Math.sin(startRad) * baseRadius * 1.5;
      const x2 = centerX + Math.cos(endRad) * baseRadius * 1.5;
      const y2 = centerY + Math.sin(endRad) * baseRadius * 1.5;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${baseRadius * 1.5} ${baseRadius * 1.5} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      return (
        <motion.path
          key={quadrant.element}
          d={pathData}
          fill={quadrant.color}
          fillOpacity={0.05}
          stroke={quadrant.color}
          strokeWidth={1}
          strokeOpacity={0.2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      );
    });
  };

  const renderActiveTransformations = () => {
    const visualData = holoflower.exportVisualizationData();
    
    return visualData.connections.map((connection, index) => {
      const fromHouse = visualData.houses.find(h => h.number === connection.from);
      const toHouse = visualData.houses.find(h => h.number === connection.to);
      
      if (!fromHouse || !toHouse) return null;
      
      const x1 = centerX + fromHouse.x;
      const y1 = centerY + fromHouse.y;
      const x2 = centerX + toHouse.x;
      const y2 = centerY + toHouse.y;
      
      return (
        <motion.line
          key={`${connection.from}-${connection.to}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#FFD700"
          strokeWidth={3}
          strokeDasharray="10,5"
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 2 * animationSpeed,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      );
    });
  };

  const handleHouseClick = (house: HoloflowerHouse) => {
    setSelectedHouse(house);
    onHouseClick?.(house);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStart || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Find nearest house
    const visualData = holoflower.exportVisualizationData();
    let nearestHouse: HoloflowerHouse | null = null;
    let minDistance = Infinity;
    
    visualData.houses.forEach(houseVis => {
      const dx = x - houseVis.x;
      const dy = y - houseVis.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance && distance < 50) {
        minDistance = distance;
        nearestHouse = state.houses.find(h => h.number === houseVis.number) || null;
      }
    });
    
    if (nearestHouse && nearestHouse.number !== dragStart.number) {
      holoflower.activateTransformation(dragStart.number, nearestHouse.number);
      onTransformation?.(dragStart.number, nearestHouse.number);
    }
    
    setDragStart(null);
  };

  const renderMetrics = () => {
    const visualData = holoflower.exportVisualizationData();
    const { consciousnessDistribution, alchemicalBalance } = visualData.metrics;
    
    return (
      <div className="metrics-panel">
        <div className="consciousness-levels">
          <h4>Consciousness Distribution</h4>
          {Object.entries(consciousnessDistribution).map(([level, value]) => (
            <div key={level} className="metric-bar">
              <span className="label">{level}</span>
              <div className="bar">
                <motion.div
                  className="fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  style={{ backgroundColor: consciousnessColors[level as ConsciousnessLevel] }}
                />
              </div>
              <span className="value">{Math.round(value * 100)}%</span>
            </div>
          ))}
        </div>
        
        <div className="alchemical-processes">
          <h4>Alchemical Balance</h4>
          {Object.entries(alchemicalBalance).map(([process, value]) => (
            <div key={process} className="metric-bar">
              <span className="label">{process}</span>
              <div className="bar">
                <motion.div
                  className="fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  style={{ backgroundColor: '#FFD700' }}
                />
              </div>
              <span className="value">{Math.round(value * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="elemental-alchemy-container">
      <div className="controls">
        <button onClick={() => setShowConsciousnessRings(!showConsciousnessRings)}>
          {showConsciousnessRings ? 'Hide' : 'Show'} Consciousness Rings
        </button>
        <button onClick={() => setShowAlchemicalOverlay(!showAlchemicalOverlay)}>
          {showAlchemicalOverlay ? 'Hide' : 'Show'} Alchemical Overlay
        </button>
        <button onClick={() => holoflower.integratePhiSpiral()}>
          Activate Phi Spiral
        </button>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
        />
        <span>Speed: {animationSpeed}x</span>
      </div>
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setDragStart(null)}
        style={{ 
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 100%)',
          borderRadius: '50%',
          cursor: dragStart ? 'grabbing' : 'default'
        }}
      >
        <defs>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF6347" />
          </radialGradient>
          
          <linearGradient id="spiralGradient">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FF6347" />
          </linearGradient>
          
          {/* Alchemical process patterns */}
          <pattern id="ascending-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 20 L10 5 M5 10 L10 5 L15 10" stroke="#87CEEB" strokeWidth="1" fill="none" opacity="0.5"/>
          </pattern>
          
          <pattern id="fire-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 15 Q5 10 10 5 Q15 10 10 15" fill="#FF6B6B" opacity="0.3"/>
          </pattern>
          
          <pattern id="crystal-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,10 10,18 2,10" fill="none" stroke="#8B6B47" strokeWidth="1" opacity="0.5"/>
          </pattern>
          
          <pattern id="wave-pattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="#6B8DD6" strokeWidth="1" opacity="0.5"/>
          </pattern>
        </defs>
        
        {renderQuadrantBackgrounds()}
        {renderActiveTransformations()}
        {renderCenterSpiral()}
        {state.houses.map(renderHouse)}
        
        {/* Drag line preview */}
        {dragStart && (
          <line
            x1={centerX + holoflower.exportVisualizationData().houses.find(h => h.number === dragStart.number)!.x}
            y1={centerY + holoflower.exportVisualizationData().houses.find(h => h.number === dragStart.number)!.y}
            x2={centerX}
            y2={centerY}
            stroke="#FFD700"
            strokeWidth={2}
            strokeDasharray="5,5"
            opacity={0.5}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </svg>
      
      {selectedHouse && (
        <div className="house-details">
          <h3>House {selectedHouse.number}: {selectedHouse.description}</h3>
          <p><strong>Element:</strong> {selectedHouse.element} {selectedHouse.sacredSymbol}</p>
          <p><strong>Phase:</strong> {selectedHouse.phase}</p>
          <p><strong>Consciousness:</strong> {selectedHouse.consciousnessLevel}</p>
          <p><strong>Process:</strong> {selectedHouse.alchemicalProcess}</p>
          <p><strong>Keywords:</strong> {selectedHouse.keywords.join(', ')}</p>
          <p><strong>Shadow:</strong> {selectedHouse.shadowAspect}</p>
          <p><strong>Gift:</strong> {selectedHouse.giftAspect}</p>
          <p><strong>Intensity:</strong> {Math.round(selectedHouse.currentIntensity * 100)}%</p>
        </div>
      )}
      
      {renderMetrics()}
      
      <style jsx>{`
        .elemental-alchemy-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: #0a0a0f;
          color: white;
          position: relative;
        }
        
        .controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          align-items: center;
          z-index: 10;
        }
        
        .controls button {
          padding: 8px 16px;
          background: #2a2a3e;
          border: 1px solid #FFD700;
          color: #FFD700;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .controls button:hover {
          background: #3a3a4e;
          transform: translateY(-2px);
        }
        
        .house-details {
          position: absolute;
          top: 80px;
          right: 20px;
          background: rgba(42, 42, 62, 0.95);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #FFD700;
          max-width: 300px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .house-details h3 {
          margin: 0 0 15px 0;
          color: #FFD700;
          font-size: 18px;
        }
        
        .house-details p {
          margin: 8px 0;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .house-details strong {
          color: #87CEEB;
        }
        
        .metrics-panel {
          position: absolute;
          top: 80px;
          left: 20px;
          background: rgba(42, 42, 62, 0.95);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #FFD700;
          width: 280px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        .metrics-panel h4 {
          margin: 0 0 15px 0;
          color: #FFD700;
          font-size: 16px;
        }
        
        .metric-bar {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 12px;
        }
        
        .metric-bar .label {
          width: 100px;
          text-transform: capitalize;
        }
        
        .metric-bar .bar {
          flex: 1;
          height: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
          margin: 0 10px;
        }
        
        .metric-bar .fill {
          height: 100%;
          border-radius: 8px;
          transition: width 0.5s ease;
        }
        
        .metric-bar .value {
          width: 40px;
          text-align: right;
        }
        
        .consciousness-levels {
          margin-bottom: 25px;
        }
      `}</style>
    </div>
  );
};