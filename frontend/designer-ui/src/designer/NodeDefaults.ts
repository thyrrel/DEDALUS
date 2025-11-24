// src/designer/NodeDefaults.ts (FINAL)

import React, { FC } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';

/**
 * Componente React para renderizar um nó customizado no React Flow.
 * Este nó exibe o label e permite inputs/outputs.
 */
export const CustomNode: FC<NodeProps> = ({ data }) => {
    // Cores baseadas no tipo de nó para diferenciação visual
    const nodeColor = data.type === 'startNode' ? '#03a9f4' : 
                      data.type === 'endNode'   ? '#f44336' : 
                      '#4caf50'; // Conectores

    return (
        <div style={{
            padding: '10px 15px',
            borderRadius: '5px',
            border: `2px solid ${nodeColor}`,
            background: 'white',
            textAlign: 'center',
            fontSize: '12px',
            minWidth: '100px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
            {/* Handle para input (onde as arestas podem se conectar) */}
            <Handle type="target" position={Position.Top} />
            
            <div>
                <strong>{data.label}</strong>
                <br />
                <small>({data.type})</small>
            </div>
            
            {/* Handle para output (onde as arestas podem se conectar) */}
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};
