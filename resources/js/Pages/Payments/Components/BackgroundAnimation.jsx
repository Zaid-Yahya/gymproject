import React, { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Animation parameters
        const paymentSymbols = [];
        const symbolCount = 30;
        
        // Symbol types
        const symbolTypes = [
            {
                draw: (ctx, x, y, size, rotation) => {
                    // Credit card symbol
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    
                    // Card body
                    ctx.beginPath();
                    ctx.roundRect(-size/2, -size/3, size, size*2/3, 5);
                    ctx.fill();
                    
                    // Card stripe
                    ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
                    ctx.fillRect(-size/2, -size/6, size, size/6);
                    
                    ctx.restore();
                }
            },
            {
                draw: (ctx, x, y, size, rotation) => {
                    // Dollar sign
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    
                    // Circle background
                    ctx.beginPath();
                    ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // $ sign
                    ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
                    ctx.font = `bold ${size*0.8}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('$', 0, 0);
                    
                    ctx.restore();
                }
            },
            {
                draw: (ctx, x, y, size, rotation) => {
                    // Secure lock
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    
                    // Lock body
                    ctx.beginPath();
                    ctx.roundRect(-size/3, -size/5, size*2/3, size*2/3, 3);
                    ctx.fill();
                    
                    // Lock arc
                    ctx.beginPath();
                    ctx.lineWidth = size/10;
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.arc(0, -size/5, size/4, Math.PI, 2*Math.PI);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            },
            {
                draw: (ctx, x, y, size, rotation) => {
                    // Check mark / receipt
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    
                    // Receipt paper
                    ctx.beginPath();
                    ctx.roundRect(-size/3, -size/2, size*2/3, size, [3, 3, 10, 10]);
                    ctx.fill();
                    
                    // Receipt lines
                    ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
                    ctx.lineWidth = size/20;
                    
                    ctx.beginPath();
                    ctx.moveTo(-size/5, -size/4);
                    ctx.lineTo(size/4, -size/4);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(-size/5, 0);
                    ctx.lineTo(size/4, 0);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(-size/5, size/4);
                    ctx.lineTo(size/4, size/4);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            }
        ];
        
        // Create payment symbols
        for (let i = 0; i < symbolCount; i++) {
            const color = Math.random() > 0.5 ? '#ff7e67' : '#ff9e7d';
            
            paymentSymbols.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 30 + 20,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: -0.2 - Math.random() * 0.5, // Move primarily upwards
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() * 0.01) - 0.005,
                opacity: Math.random() * 0.12 + 0.05,
                color: color,
                symbol: symbolTypes[Math.floor(Math.random() * symbolTypes.length)],
                pulse: 0,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
        
        // Animation function
        const animate = () => {
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#ff9e7d');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw patterns
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            
            // Draw hexagon pattern
            const hexSize = 30;
            const hexHeight = hexSize * Math.sqrt(3);
            const hexWidth = hexSize * 2;
            
            for (let y = -hexHeight; y < canvas.height + hexHeight; y += hexHeight) {
                for (let x = -hexWidth; x < canvas.width + hexWidth; x += hexWidth * 1.5) {
                    const offset = Math.floor(y / hexHeight) % 2 === 0 ? 0 : hexWidth * 0.75;
                    
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = Math.PI / 3 * i;
                        const px = x + offset + hexSize * Math.cos(angle);
                        const py = y + hexSize * Math.sin(angle);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fill();
                }
            }
            
            // Update and draw payment symbols
            paymentSymbols.forEach(symbol => {
                // Update position
                symbol.x += symbol.speedX;
                symbol.y += symbol.speedY;
                symbol.rotation += symbol.rotationSpeed;
                
                // Update pulse for subtle size change
                symbol.pulse += symbol.pulseSpeed;
                const pulseFactor = 1 + Math.sin(symbol.pulse) * 0.1;
                
                // Wrap around edges
                if (symbol.x < -symbol.size) symbol.x = canvas.width + symbol.size;
                if (symbol.x > canvas.width + symbol.size) symbol.x = -symbol.size;
                if (symbol.y < -symbol.size) symbol.y = canvas.height + symbol.size;
                if (symbol.y > canvas.height + symbol.size) symbol.y = -symbol.size;
                
                // Draw symbol
                ctx.fillStyle = `rgba(${hexToRgb(symbol.color)}, ${symbol.opacity})`;
                symbol.symbol.draw(
                    ctx,
                    symbol.x,
                    symbol.y,
                    symbol.size * pulseFactor,
                    symbol.rotation
                );
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        // Helper function to convert hex to rgb
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
                '0, 0, 0';
        };
        
        // Start animation
        animate();
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    
    return (
        <canvas 
            ref={canvasRef} 
            className="background-animation"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none'
            }}
        />
    );
} 