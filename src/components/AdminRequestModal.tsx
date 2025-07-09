import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRequestModalProps {
  children: React.ReactNode;
}

const AdminRequestModal = ({ children }: AdminRequestModalProps) => {
  const [reason, setReason] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setLoading(true);

    try {
      // Insert the admin request into the database
      const { error: insertError } = await supabase
        .from('admin_requests')
        .insert({
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          department,
          reason,
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-admin-request-notification', {
          body: {
            name: user.user_metadata?.full_name || user.email,
            email: user.email,
            department,
            reason
          }
        });

        if (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't throw here - the request was still saved successfully
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Continue - the request was saved successfully
      }

      toast({
        title: "Request Submitted",
        description: "Your admin access request has been submitted for review and notification sent.",
      });

      setReason('');
      setDepartment('');
      setOpen(false); // Close the modal
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-emerald-700">Request Admin Access</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Parks & Recreation"
              required
              className="border-emerald-300 focus:border-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Admin Access</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need admin access..."
              required
              className="border-emerald-300 focus:border-emerald-500"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            disabled={loading}
          >
            {loading ? 'Submitting Request...' : 'Submit Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminRequestModal;