import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { locationsData } from '../data/locations';

const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  dob: yup.date().required('Date of birth is required').typeError('Invalid date'),
  education: yup.string().required('Education is required'),
  division: yup.string().required('Division is required'),
  district: yup.string().required('District is required'),
  thana: yup.string().required('Thana is required'),
  service_interest: yup.string().required('Service interest is required')
    .oneOf(['CV Builder', 'Private Social Media', 'Premium TV', 'Travel Platform', 'Others']),
});

export default function Register() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      division: '',
      district: '',
      thana: '',
      service_interest: ''
    }
  });

  const selectedDivision = watch('division');
  const selectedDistrict = watch('district');

  const availableDistricts = selectedDivision ? (locationsData.districts[selectedDivision] || []) : [];
  const availableThanas = selectedDistrict ? (locationsData.thanas[selectedDistrict] || []) : [];

  const onSubmit = async (data) => {
    setGlobalError('');
    try {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        dob: new Date(data.dob).toISOString().split('T')[0],
        education: data.education,
        address: {
          division: data.division,
          district: data.district,
          thana: data.thana
        },
        service_interest: data.service_interest
      };

      await registerAuth(payload);
      // Navigate to a "pending review" page or dashboard
      navigate('/dashboard');
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const InputWrapper = ({ label, error, children }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
    </div>
  );

  const inputClasses = "w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full glass rounded-3xl shadow-2xl p-8 relative z-10 border border-slate-700/50">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Join Smart Digital Services today.</p>
        </div>

        {globalError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm">
            {globalError}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="First Name" error={errors.first_name}>
              <input type="text" {...register('first_name')} className={inputClasses} placeholder="John" />
            </InputWrapper>
            
            <InputWrapper label="Last Name" error={errors.last_name}>
              <input type="text" {...register('last_name')} className={inputClasses} placeholder="Doe" />
            </InputWrapper>
          </div>

          <InputWrapper label="Email Address" error={errors.email}>
            <input type="email" {...register('email')} className={inputClasses} placeholder="john@example.com" />
          </InputWrapper>

          <InputWrapper label="Password" error={errors.password}>
            <input type="password" {...register('password')} className={inputClasses} placeholder="••••••••" />
          </InputWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="Date of Birth" error={errors.dob}>
              <input type="date" {...register('dob')} className={inputClasses} />
            </InputWrapper>

            <InputWrapper label="Education Qualification" error={errors.education}>
              <input type="text" {...register('education')} className={inputClasses} placeholder="B.Sc in Computer Science" />
            </InputWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-700/50 rounded-2xl bg-slate-900/30">
            <h4 className="col-span-1 md:col-span-3 text-emerald-400 font-medium text-sm mb-2">Address</h4>
            
            <InputWrapper label="Division" error={errors.division}>
              <select {...register('division')} className={inputClasses}>
                <option value="">Select Division</option>
                {locationsData.divisions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </InputWrapper>

            <InputWrapper label="District" error={errors.district}>
              <select {...register('district')} className={inputClasses} disabled={!selectedDivision}>
                <option value="">Select District</option>
                {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </InputWrapper>

            <InputWrapper label="Thana" error={errors.thana}>
              <select {...register('thana')} className={inputClasses} disabled={!selectedDistrict}>
                <option value="">Select Thana</option>
                {availableThanas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </InputWrapper>
          </div>

          <InputWrapper label="Select Your Service Interest" error={errors.service_interest}>
            <select {...register('service_interest')} className={inputClasses}>
                <option value="">Choose Service...</option>
                <option value="CV Builder">CV Builder</option>
                <option value="Private Social Media">Private Social Media</option>
                <option value="Premium TV">Premium TV</option>
                <option value="Travel Platform">Travel Platform</option>
                <option value="Others">Others</option>
            </select>
            <p className="mt-2 text-xs text-slate-400">If you select 'CV Builder', your account will require admin approval.</p>
          </InputWrapper>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
