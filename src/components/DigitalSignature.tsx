
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DigitalSignatureProps {
  onSignature: (signature: string) => void;
  driverName: string;
}

const DigitalSignature = ({ onSignature, driverName }: DigitalSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setIsEmpty(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const submitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signature = canvas.toDataURL();
    onSignature(signature);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-800">Digital Signature</CardTitle>
          <p className="text-slate-600">Sign below to complete your inspection</p>
          <p className="text-sm text-slate-500">Driver: {driverName}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-slate-300 rounded-lg bg-white">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="w-full h-48 cursor-crosshair rounded-lg"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              By signing above, I certify that I have completed this vehicle inspection to the best of my ability.
            </p>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={clearSignature}
                className="flex-1"
              >
                Clear
              </Button>
              <Button 
                type="button" 
                onClick={submitSignature}
                disabled={isEmpty}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
              >
                Submit Inspection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalSignature;
