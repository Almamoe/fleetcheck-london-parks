
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DriverSignInProps {
  onSignIn: (name: string, id: string) => void;
  onGoToDashboard: () => void;
}

const DriverSignIn = ({ onSignIn, onGoToDashboard }: DriverSignInProps) => {
  const [name, setName] = useState('');
  const [driverId, setDriverId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && driverId.trim()) {
      onSignIn(name.trim(), driverId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
            alt="City of London"
            className="h-20 w-20 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">FleetCheck</h1>
          <p className="text-emerald-700">City of London Parks & Recreation</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8 bg-emerald-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Driver Sign In</CardTitle>
            <p className="text-emerald-100 mt-2">Enter your details to begin inspection</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-emerald-800">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 text-base border-emerald-300 focus:border-emerald-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driverId" className="text-sm font-medium text-emerald-800">
                  Driver ID
                </Label>
                <Input
                  id="driverId"
                  type="text"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  placeholder="Enter your driver ID"
                  className="h-12 text-base border-emerald-300 focus:border-emerald-500"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                disabled={!name.trim() || !driverId.trim()}
              >
                Sign In & Start Inspection
              </Button>
            </form>
            
            <div className="text-center">
              <Button 
                variant="outline"
                onClick={onGoToDashboard}
                className="w-full h-12 text-base border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverSignIn;
