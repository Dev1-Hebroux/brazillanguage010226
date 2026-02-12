import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

interface CohortApplicationFormProps {
  trackId: string;
  trackTitle: string;
  trigger: React.ReactNode;
}

export default function CohortApplicationForm({ trackId, trackTitle, trigger }: CohortApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [motivation, setMotivation] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/cohort-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || null,
          trackId,
          englishLevel,
          motivation: motivation || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        toast({ title: "Application submitted!", description: "We'll be in touch soon." });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setEnglishLevel("");
    setMotivation("");
    setSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold" data-testid="text-apply-title">
            {submitted ? "Application Sent!" : `Apply for ${trackTitle}`}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "Thank you for applying. We'll contact you with next steps."
              : "Fill out this form and we'll get back to you within 48 hours."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-center text-muted-foreground font-medium">
              Check your email for confirmation details.
            </p>
            <Button onClick={() => setOpen(false)} className="rounded-full px-8" data-testid="button-close-success">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-bold text-sm">Full Name *</Label>
              <Input
                id="fullName"
                data-testid="input-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Your full name"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-sm">Email *</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold text-sm">Phone / WhatsApp</Label>
              <Input
                id="phone"
                data-testid="input-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 61 99999-9999"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="englishLevel" className="font-bold text-sm">Current English Level *</Label>
              <Select value={englishLevel} onValueChange={setEnglishLevel} required>
                <SelectTrigger className="h-11 rounded-xl" data-testid="select-level">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No English at all</SelectItem>
                  <SelectItem value="beginner">Beginner - I know a few words</SelectItem>
                  <SelectItem value="elementary">Elementary - I can say simple sentences</SelectItem>
                  <SelectItem value="intermediate">Intermediate - I can have basic conversations</SelectItem>
                  <SelectItem value="advanced">Advanced - I'm fairly comfortable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation" className="font-bold text-sm">Why do you want to learn English?</Label>
              <Textarea
                id="motivation"
                data-testid="input-motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tell us a bit about your goals..."
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !englishLevel}
              className="w-full h-12 rounded-xl font-bold text-lg shadow-lg"
              data-testid="button-apply-submit"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
