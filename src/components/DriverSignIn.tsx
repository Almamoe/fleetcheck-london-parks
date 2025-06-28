
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DriverSignInProps {
  onSignIn: (name: string, id: string) => void;
}

const DriverSignIn = ({ onSignIn }: DriverSignInProps) => {
  const [name, setName] = useState('');
  const [driverId, setDriverId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && driverId.trim()) {
      onSignIn(name.trim(), driverId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl text-slate-800">Driver Sign In</CardTitle>
          <p className="text-slate-600 mt-2">Enter your details to begin inspection</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 text-base"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverId" className="text-sm font-medium text-slate-700">
                Driver ID
              </Label>
              <Input
                id="driverId"
                type="text"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                placeholder="Enter your driver ID"
                className="h-12 text-base"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-slate-800 hover:bg-slate-700 text-white font-medium"
              disabled={!name.trim() || !driverId.trim()}
            >
              Sign In & Start Inspection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverSignIn;
