import React, { useState } from 'react';
import { User, Camera, MapPin, Building, Waves, Users, ShoppingBag, Heart } from 'lucide-react';

interface UserOnboardingProps {
  onComplete: (userData: any) => void;
  onSkip: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    favoriteSpot: '',
    userType: '',
    interests: [] as string[],
    location: ''
  });

  const userTypes = [
    {
      id: 'pro-photographer',
      label: 'Professional Photographer',
      icon: Camera,
      description: 'I make a living from surf photography'
    },
    {
      id: 'semi-pro-photographer',
      label: 'Semi-Pro Photographer',
      icon: Camera,
      description: 'I sell photos occasionally but it\'s not my main income'
    },
    {
      id: 'amateur-photographer',
      label: 'Amateur Photographer',
      icon: Heart,
      description: 'I love taking surf photos as a hobby'
    },
    {
      id: 'surf-school',
      label: 'Surf School',
      icon: Users,
      description: 'I run or work for a surf school'
    },
    {
      id: 'urban-surf-site',
      label: 'Urban Surf Site',
      icon: Building,
      description: 'I operate an urban surf facility (wave pools, etc.)'
    },
    {
      id: 'river-surf-site',
      label: 'River Surf Site',
      icon: Waves,
      description: 'I\'m involved with river surfing locations'
    },
    {
      id: 'business-buyer',
      label: 'Business/Media Buyer',
      icon: ShoppingBag,
      description: 'I buy photos for commercial use, media, or marketing'
    },
    {
      id: 'surf-enthusiast',
      label: 'Surf Enthusiast',
      icon: Heart,
      description: 'I love surfing and surf culture'
    }
  ];

  const surfSpots = [
    'Pipeline, Hawaii',
    'Gold Coast, Australia',
    'Jeffreys Bay, South Africa',
    'Ericeira, Portugal',
    'Uluwatu, Bali',
    'Tavarua, Fiji',
    'Mavericks, California',
    'Hossegor, France',
    'Puerto Escondido, Mexico',
    'Raglan, New Zealand',
    'Mundaka, Spain',
    'Supertubes, South Africa',
    'Other'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleUserTypeSelect = (userType: string) => {
    setFormData(prev => ({ ...prev, userType }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SurfSpotter!</h2>
        <p className="text-gray-600">Let's get to know you better to personalize your experience</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            placeholder="Where are you based?"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What describes you best?</h2>
        <p className="text-gray-600">This helps us tailor your SurfSpotter experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => handleUserTypeSelect(type.id)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:border-orange-500 ${
                formData.userType === type.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <IconComponent className={`h-6 w-6 mt-1 ${
                  formData.userType === type.id ? 'text-orange-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your favorite surf spot?</h2>
        <p className="text-gray-600">We'll show you more content from spots you love</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {surfSpots.map((spot) => (
          <button
            key={spot}
            onClick={() => setFormData(prev => ({ ...prev, favoriteSpot: spot }))}
            className={`p-3 border-2 rounded-lg text-left transition-all hover:border-orange-500 ${
              formData.favoriteSpot === spot
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MapPin className={`h-5 w-5 ${
                formData.favoriteSpot === spot ? 'text-orange-600' : 'text-gray-400'
              }`} />
              <span className="font-medium text-gray-900">{spot}</span>
            </div>
          </button>
        ))}
      </div>

      {formData.favoriteSpot === 'Other' && (
        <div>
          <input
            type="text"
            placeholder="Tell us your favorite surf spot"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            onChange={(e) => setFormData(prev => ({ ...prev, favoriteSpot: e.target.value }))}
          />
        </div>
      )}
    </div>
  );

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.username.trim() && formData.email.trim();
      case 2:
        return formData.userType;
      case 3:
        return formData.favoriteSpot;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
              {step === 1 && (
                <button
                  onClick={onSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;