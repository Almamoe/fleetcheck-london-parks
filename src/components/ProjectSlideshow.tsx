import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle, Users, Car, FileText, Database, Zap, Target } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "FleetCheck Dashboard Project Overview",
    icon: <Car className="h-8 w-8 text-emerald-600" />,
    content: [
      "Digital vehicle inspection system for City of London fleet",
      "Streamlines daily vehicle safety checks and compliance",
      "Replaces paper-based processes with digital workflow",
      "Ensures supervisor oversight and accountability",
      "Provides complete audit trail for safety compliance"
    ]
  },
  {
    id: 2,
    title: "Technology Stack & Implementation",
    icon: <Database className="h-8 w-8 text-blue-600" />,
    content: [
      "Frontend: React with TypeScript for type safety",
      "Backend: Supabase for real-time database and authentication",
      "UI Framework: Tailwind CSS with shadcn/ui components",
      "Email Integration: Resend API for supervisor notifications",
      "PDF Generation: Automated inspection reports",
      "Digital Signatures: Canvas-based signature capture"
    ]
  },
  {
    id: 3,
    title: "Core Features Delivered",
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    content: [
      "Driver authentication and sign-in system",
      "Comprehensive start/end of day inspection forms",
      "Digital signature capture for legal compliance",
      "Supervisor selection and email notifications",
      "Real-time dashboard with inspection history",
      "Vehicle and supervisor management system"
    ]
  },
  {
    id: 4,
    title: "Current Capabilities",
    icon: <Zap className="h-8 w-8 text-yellow-600" />,
    content: [
      "Real-time data synchronization across devices",
      "Offline fallback with local storage backup",
      "Mobile-responsive design for tablet/smartphone use",
      "Automated email confirmations to supervisors",
      "Comprehensive inspection data tracking",
      "Secure user authentication and data protection"
    ]
  },
  {
    id: 5,
    title: "Enhancement Opportunities",
    icon: <Target className="h-8 w-8 text-purple-600" />,
    content: [
      "Advanced analytics and reporting dashboards",
      "Integration with fleet management systems",
      "Mobile app for better field usability",
      "Barcode/QR code scanning for vehicle identification",
      "Photo documentation for inspection issues",
      "Push notifications for critical safety alerts"
    ]
  },
  {
    id: 6,
    title: "Resources Needed for Next Phase",
    icon: <Users className="h-8 w-8 text-red-600" />,
    content: [
      "Mobile development resources (React Native/Flutter)",
      "Integration specialist for existing fleet systems",
      "UX designer for enhanced user experience",
      "Additional Supabase storage for photo documentation",
      "API development for third-party integrations",
      "Quality assurance testing across multiple devices"
    ]
  },
  {
    id: 7,
    title: "Business Impact & ROI",
    icon: <FileText className="h-8 w-8 text-indigo-600" />,
    content: [
      "Eliminates paper-based processes and manual filing",
      "Reduces inspection time by 40-50% per vehicle",
      "Improves compliance tracking and audit readiness",
      "Enhances supervisor oversight and accountability",
      "Provides data-driven insights for fleet optimization",
      "Scales efficiently as fleet size grows"
    ]
  }
];

export function ProjectSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/lovable-uploads/d06e4237-0209-4e8b-ab56-fa47f79f7ca5.png"
              alt="City of London"
              className="h-12 w-12"
            />
            <h1 className="text-3xl font-bold text-slate-800">
              FleetCheck Project Presentation
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <span>Slide {currentSlide + 1} of {slides.length}</span>
          </div>
        </div>

        {/* Main Slide */}
        <Card className="bg-white shadow-2xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              {slides[currentSlide].icon}
              {slides[currentSlide].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ul className="space-y-4">
              {slides[currentSlide].content.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0" />
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={prevSlide}
            variant="outline"
            className="flex items-center gap-2"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-emerald-600'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            variant="outline"
            className="flex items-center gap-2"
            disabled={currentSlide === slides.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-7 gap-2">
          {slides.map((slide, index) => (
            <Button
              key={slide.id}
              onClick={() => goToSlide(index)}
              variant={index === currentSlide ? "default" : "outline"}
              size="sm"
              className="text-xs p-2 h-auto"
            >
              <div className="text-center">
                <div className="mb-1 flex justify-center">{slide.icon}</div>
                <div className="leading-tight">{slide.title.split(' ').slice(0, 2).join(' ')}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}