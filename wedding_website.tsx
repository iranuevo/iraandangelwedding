import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, Calendar, Camera, Users, Mail, ChevronDown, Sparkles } from 'lucide-react';

const WeddingWebsite = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [showRsvpConfirm, setShowRsvpConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isWeddingDay, setIsWeddingDay] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    attending: 'yes',
    message: ''
  });

  // REPLACE THIS URL with your Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8I7l2S9h7LUaQ-enyscRberi4xEtNKPkF2Czn-H8i3ci-ppnKEuDY75BfM-DZF3s/exec';

  // Countdown Timer
  useEffect(() => {
    const weddingDate = new Date('2026-06-27T14:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        setIsWeddingDay(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
        setIsWeddingDay(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            entry.target.classList.add('section-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          guests: formData.guests,
          attending: formData.attending,
          message: formData.message,
          timestamp: new Date().toLocaleString()
        })
      });

      // Since we're using no-cors, we can't read the response
      // We'll assume success if no error is thrown
      setShowRsvpConfirm(true);
      setTimeout(() => setShowRsvpConfirm(false), 5000);
      setFormData({
        name: '',
        email: '',
        guests: '1',
        attending: 'yes',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitError('There was an error submitting your RSVP. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-gray-800 bg-white overflow-hidden">
      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-heart absolute"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          >
            <Heart className="w-4 h-4 text-rose-200 opacity-30" fill="currentColor" />
          </div>
        ))}
      </div>

      {/* Cursor Trail Effect */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-50 transition-transform duration-300 ease-out"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          opacity: 0.3
        }}
      >
        <div className="w-full h-full rounded-full bg-rose-300 blur-xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-md shadow-sm z-50 transition-all duration-500 border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 heart-beat" fill="currentColor" />
              <span className="font-serif text-xl text-gray-800">Ira & Angel</span>
            </div>
            <div className="flex justify-center items-center gap-8 text-sm tracking-widest">
              {['Our Story', 'Details', 'Gallery', 'RSVP'].map((item, i) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="relative hover:text-rose-400 transition-all duration-300 group hidden md:block"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>
            <button 
              onClick={() => scrollToSection('rsvp')}
              className="bg-gradient-to-r from-rose-400 to-pink-400 text-white px-6 py-2 rounded-full text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              RSVP Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-green-50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flower-bloom absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="flower-bloom absolute bottom-32 right-20 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-3xl" style={{animationDelay: '2s'}}></div>
          <div className="flower-bloom absolute top-1/2 left-1/3 w-24 h-24 bg-pink-200 rounded-full opacity-15 blur-2xl" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="text-center z-10 px-6 slide-up">
          <div className="mb-8 heart-beat">
            <Heart className="w-16 h-16 mx-auto text-rose-300" fill="currentColor" />
          </div>
          
          <div className="letter-spacing">
            <h1 className="font-serif text-7xl md:text-9xl mb-6 text-gray-800 tracking-tight fade-in-scale">
              Ira & Angel
            </h1>
          </div>
          
          <div className="divider-line w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-6"></div>
          
          <p className="text-xl md:text-2xl text-gray-500 mb-10 italic font-light fade-in-up leading-relaxed" style={{animationDelay: '0.3s'}}>
            Merging our branches into one repository of love
            <br />
            <span className="text-sm text-gray-400 not-italic">// Committing to forever 💕</span>
          </p>
          
          <div className="text-lg md:text-xl text-gray-600 mb-16 space-y-2 fade-in-up" style={{animationDelay: '0.5s'}}>
            <p className="font-light tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              JUNE 27, 2026
              <Sparkles className="w-4 h-4 text-rose-400" />
            </p>
            <p className="text-base text-gray-400">Nuestra Señora de Gracia Parish</p>
          </div>

          {!isWeddingDay && (
            <div className="countdown-container mb-12 fade-in-scale" style={{animationDelay: '0.7s'}}>
              <p className="text-sm text-rose-400 mb-4 tracking-widest uppercase">Counting down to our special day</p>
              <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
                <div className="countdown-box bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-rose-100">
                  <div className="text-3xl md:text-5xl font-serif text-rose-400 mb-2 countdown-number font-bold">{countdown.days}</div>
                  <div className="text-xs md:text-sm text-gray-500 tracking-widest uppercase">Days</div>
                </div>
                <div className="countdown-box bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-rose-100">
                  <div className="text-3xl md:text-5xl font-serif text-rose-400 mb-2 countdown-number font-bold">{countdown.hours}</div>
                  <div className="text-xs md:text-sm text-gray-500 tracking-widest uppercase">Hours</div>
                </div>
                <div className="countdown-box bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-rose-100">
                  <div className="text-3xl md:text-5xl font-serif text-rose-400 mb-2 countdown-number font-bold">{countdown.minutes}</div>
                  <div className="text-xs md:text-sm text-gray-500 tracking-widest uppercase">Mins</div>
                </div>
                <div className="countdown-box bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-rose-100">
                  <div className="text-3xl md:text-5xl font-serif text-rose-400 mb-2 countdown-number font-bold">{countdown.seconds}</div>
                  <div className="text-xs md:text-sm text-gray-500 tracking-widest uppercase">Secs</div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => scrollToSection('our-story')}
            className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-600 transition-all duration-500 float-animation"
          >
            <span className="text-sm tracking-widest">Discover Our Story</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Our Story */}
      <section id="our-story" className="py-32 px-6 bg-white relative section-fade">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">Our Story</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto"></div>
          </div>
          
          <div className="space-y-16">
            <div className="story-card group">
              <div className="flex items-start gap-4 mb-4">
                <div className="heart-icon-small">
                  <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
                </div>
                <h3 className="font-serif text-3xl text-rose-400">The Beginning</h3>
              </div>
              <p className="text-gray-600 leading-loose text-lg font-light pl-9">
                It was a crisp autumn evening in October 2019 when our paths first crossed at a mutual friend's gallery opening in Brooklyn. James was admiring a piece of abstract art, and Sophia accidentally bumped into him while stepping back to get a better view. That clumsy moment turned into hours of conversation about art, travel, and our shared love of terrible puns.
              </p>
            </div>

            <div className="story-card group">
              <div className="flex items-start gap-4 mb-4">
                <div className="heart-icon-small">
                  <Heart className="w-5 h-5 text-green-600" fill="currentColor" />
                </div>
                <h3 className="font-serif text-3xl text-green-600">Growing Together</h3>
              </div>
              <p className="text-gray-600 leading-loose text-lg font-light pl-9">
                What started as coffee dates at our favorite corner café evolved into weekend adventures exploring hidden bookstores, cooking experiments that sometimes ended in laughter and takeout, and long walks through Central Park during every season. Through career changes, family celebrations, and everything in between, we discovered that home isn't a place—it's being together.
              </p>
            </div>

            <div className="story-card group">
              <div className="flex items-start gap-4 mb-4">
                <div className="heart-icon-small">
                  <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
                </div>
                <h3 className="font-serif text-3xl text-rose-400">The Proposal</h3>
              </div>
              <p className="text-gray-600 leading-loose text-lg font-light pl-9">
                On a surprise trip to the Amalfi Coast in May 2024, James took Sophia to a secluded cliff overlooking the Mediterranean at sunset. As the golden hour painted the sky in shades of pink and orange, he got down on one knee and asked the question that would change everything. Through happy tears, Sophia said yes, and we celebrated with limoncello and the promise of forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section id="details" className="py-32 px-6 bg-gradient-to-b from-rose-50 to-white section-fade">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">Event Details</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="detail-card bg-white rounded-2xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-rose-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="icon-pulse bg-rose-50 p-4 rounded-2xl">
                  <Heart className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="font-serif text-4xl text-gray-800">Ceremony</h3>
              </div>
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start gap-4 detail-item bg-rose-50 p-4 rounded-xl">
                  <Calendar className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">June 27, 2026</p>
                    <p className="text-sm text-gray-400">Saturday</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 detail-item bg-rose-50 p-4 rounded-xl">
                  <Clock className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">2:00 PM</p>
                    <p className="text-sm text-gray-400">Ceremony begins promptly</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 detail-item bg-rose-50 p-4 rounded-xl">
                  <MapPin className="w-6 h-6 text-rose-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">Nuestra Señora de Gracia Parish</p>
                    <p className="text-sm text-gray-400">Makati City, Metro Manila</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-card bg-white rounded-2xl p-12 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-green-100" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-4 mb-8">
                <div className="icon-pulse bg-green-50 p-4 rounded-2xl" style={{animationDelay: '0.5s'}}>
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-serif text-4xl text-gray-800">Reception</h3>
              </div>
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start gap-4 detail-item bg-green-50 p-4 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">June 27, 2026</p>
                    <p className="text-sm text-gray-400">Immediately following ceremony</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 detail-item bg-green-50 p-4 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">4:00 PM - 10:00 PM</p>
                    <p className="text-sm text-gray-400">Cocktails, dinner, and dancing</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 detail-item bg-green-50 p-4 rounded-xl">
                  <MapPin className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-lg">The Manila Peninsula</p>
                    <p className="text-sm text-gray-400">Makati City, Metro Manila</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-32 px-6 bg-white section-fade">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">Timeline</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto"></div>
          </div>
          
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 via-green-200 to-rose-200 transform md:-translate-x-1/2"></div>
            
            {[
              { time: '1:30 PM', title: 'Guest Arrival', desc: 'Welcome to the church', color: 'rose' },
              { time: '2:00 PM', title: 'Ceremony Begins', desc: 'Please be seated by 1:55 PM', color: 'green' },
              { time: '3:00 PM', title: 'Cocktail Hour', desc: 'Transfer to Manila Peninsula', color: 'rose' },
              { time: '4:00 PM', title: 'Reception Begins', desc: 'Dinner service starts', color: 'green' },
              { time: '5:30 PM', title: 'First Dance & Toasts', desc: 'Speeches from loved ones', color: 'rose' },
              { time: '6:00 PM', title: 'Dancing & Celebration', desc: 'Live band performance', color: 'green' },
              { time: '10:00 PM', title: 'Send-Off', desc: 'Grand exit with sparklers', color: 'rose' }
            ].map((event, index) => (
              <div key={index} className={`timeline-item relative mb-16 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'} pl-10 md:w-1/2`}>
                <div className={`timeline-dot absolute left-0 md:left-auto md:right-0 top-3 w-5 h-5 rounded-full border-4 border-white transform md:translate-x-1/2 shadow-lg ${event.color === 'rose' ? 'bg-rose-400' : 'bg-green-500'}`}></div>
                <div className={`timeline-card bg-gradient-to-br ${event.color === 'rose' ? 'from-rose-50 to-pink-50' : 'from-green-50 to-emerald-50'} p-8 rounded-2xl hover:shadow-xl transition-all duration-500`}>
                  <p className={`${event.color === 'rose' ? 'text-rose-500' : 'text-green-600'} font-medium text-lg mb-2 tracking-wide`}>{event.time}</p>
                  <h3 className="font-serif text-2xl mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-gray-500 text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-32 px-6 bg-gradient-to-b from-rose-50 to-white section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="icon-pulse mb-6">
              <Camera className="w-12 h-12 mx-auto text-rose-400" />
            </div>
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">Our Gallery</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg font-light">Moments from our journey together</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="gallery-item aspect-square bg-gradient-to-br from-rose-100 via-pink-50 to-green-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:rotate-2"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-300 relative overflow-hidden">
                  <div className="shimmer absolute inset-0"></div>
                  <Camera className="w-16 h-16 z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Party */}
      <section id="party" className="py-32 px-6 bg-white section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">Our Wedding Party</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h3 className="font-serif text-4xl text-center mb-12 text-rose-400">Bridesmaids</h3>
              <div className="space-y-10">
                {[
                  { name: 'Emma Richardson', role: 'Maid of Honor', relation: 'Sister' },
                  { name: 'Olivia Chen', role: 'Bridesmaid', relation: 'Best Friend' },
                  { name: 'Ava Martinez', role: 'Bridesmaid', relation: 'College Roommate' }
                ].map((person, i) => (
                  <div key={i} className="party-member text-center" style={{animationDelay: `${i * 0.15}s`}}>
                    <div className="party-avatar w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500">
                      <Users className="w-12 h-12 text-rose-500" />
                    </div>
                    <h4 className="font-serif text-2xl mb-2 text-gray-800">{person.name}</h4>
                    <p className="text-rose-500 text-sm font-medium tracking-wide">{person.role}</p>
                    <p className="text-gray-400 text-sm">{person.relation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-4xl text-center mb-12 text-green-600">Groomsmen</h3>
              <div className="space-y-10">
                {[
                  { name: 'Michael Thompson', role: 'Best Man', relation: 'Brother' },
                  { name: 'David Park', role: 'Groomsman', relation: 'Childhood Friend' },
                  { name: 'Ryan Foster', role: 'Groomsman', relation: 'Work Colleague' }
                ].map((person, i) => (
                  <div key={i} className="party-member text-center" style={{animationDelay: `${i * 0.15}s`}}>
                    <div className="party-avatar w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500">
                      <Users className="w-12 h-12 text-green-600" />
                    </div>
                    <h4 className="font-serif text-2xl mb-2 text-gray-800">{person.name}</h4>
                    <p className="text-green-700 text-sm font-medium tracking-wide">{person.role}</p>
                    <p className="text-gray-400 text-sm">{person.relation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section id="dress-code" className="py-32 px-6 bg-gradient-to-b from-rose-50 to-white section-fade">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-6xl md:text-7xl mb-6 text-gray-800 fade-in-up">Dress Code</h2>
          <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto mb-8"></div>
          <p className="text-3xl font-serif text-rose-400 mb-16 italic">Garden Formal</p>
          
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <div className="dress-card bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <h3 className="font-serif text-3xl mb-6 text-gray-800">For Her</h3>
              <p className="text-gray-600 leading-relaxed">
                Floor-length gowns or elegant cocktail dresses in soft, romantic colors. Think flowing fabrics, floral prints, and pastel tones. Comfortable shoes recommended for garden terrain.
              </p>
            </div>
            <div className="dress-card bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2" style={{animationDelay: '0.2s'}}>
              <h3 className="font-serif text-3xl mb-6 text-gray-800">For Him</h3>
              <p className="text-gray-600 leading-relaxed">
                Suits in light colors such as tan, beige, or light gray. Ties optional. Linen or lightweight fabrics perfect for the season. Dress shoes suitable for outdoor settings.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { name: 'Dusty Pink', color: 'bg-rose-300' },
              { name: 'Sage Green', color: 'bg-green-300' },
              { name: 'Blush', color: 'bg-pink-200' },
              { name: 'Ivory', color: 'bg-stone-100' },
              { name: 'Mint', color: 'bg-emerald-200' }
            ].map((item, i) => (
              <div key={item.name} className="color-swatch text-center" style={{animationDelay: `${i * 0.1}s`}}>
                <div className={`w-24 h-24 rounded-full mb-3 ${item.color} shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110`}></div>
                <p className="text-sm text-gray-500 tracking-wide">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-32 px-6 bg-white section-fade">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <div className="icon-pulse mb-6">
              <Mail className="w-12 h-12 mx-auto text-rose-400" />
            </div>
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">RSVP</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto mb-6"></div>
            <p className="text-gray-500 text-lg font-light">Please respond by April 15, 2026</p>
          </div>

          {showRsvpConfirm && (
            <div className="confirm-message mb-10 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-center shadow-lg">
              <p className="text-green-700 font-medium text-lg">Thank you for your RSVP! We can't wait to celebrate with you. ✨</p>
            </div>
          )}

          {submitError && (
            <div className="mb-10 p-8 bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-200 rounded-2xl text-center shadow-lg">
              <p className="text-red-700 font-medium text-lg">{submitError}</p>
            </div>
          )}
          
          <div className="rsvp-form bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 p-12 rounded-3xl shadow-2xl space-y-8 border-2 border-rose-100">
            <div className="input-group">
              <label className="block text-gray-700 mb-3 font-medium tracking-wide text-sm uppercase">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white text-lg"
                placeholder="John & Jane Doe"
              />
            </div>

            <div className="input-group">
              <label className="block text-gray-700 mb-3 font-medium tracking-wide text-sm uppercase">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white text-lg"
                placeholder="you@example.com"
              />
            </div>

            <div className="input-group">
              <label className="block text-gray-700 mb-3 font-medium tracking-wide text-sm uppercase">Number of Guests *</label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white cursor-pointer text-lg"
              >
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="block text-gray-700 mb-3 font-medium tracking-wide text-sm uppercase">Will you be attending? *</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="radio-label flex items-center justify-center gap-3 cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 hover:border-rose-300 hover:bg-white hover:shadow-lg">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={(e) => setFormData({...formData, attending: e.target.value})}
                    className="w-5 h-5 text-rose-400"
                  />
                  <span className={`text-lg ${formData.attending === 'yes' ? 'text-rose-500 font-medium' : ''}`}>Joyfully accept</span>
                </label>
                <label className="radio-label flex items-center justify-center gap-3 cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 hover:border-rose-300 hover:bg-white hover:shadow-lg">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={(e) => setFormData({...formData, attending: e.target.value})}
                    className="w-5 h-5 text-rose-400"
                  />
                  <span className={`text-lg ${formData.attending === 'no' ? 'text-rose-500 font-medium' : ''}`}>Regretfully decline</span>
                </label>
              </div>
            </div>

            <div className="input-group">
              <label className="block text-gray-700 mb-3 font-medium tracking-wide text-sm uppercase">Message for the Couple</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="4"
                className="w-full px-6 py-4 rounded-2xl border-2 border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 resize-none bg-white text-lg"
                placeholder="Share your well wishes..."
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-button w-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 hover:from-rose-500 hover:via-pink-500 hover:to-rose-500 text-white font-medium py-5 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Sending...' : 'Send RSVP ✨'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-32 px-6 bg-gradient-to-b from-rose-50 to-white section-fade">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-6xl md:text-7xl mb-4 text-gray-800 fade-in-up">Questions</h2>
            <div className="divider-line w-16 h-0.5 bg-rose-300 mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: 'Where should we park?',
                a: 'Complimentary valet parking will be available at the venue entrance. Additional parking is available in the main lot, a short 2-minute walk from the ceremony site.'
              },
              {
                q: 'What about gifts?',
                a: 'Your presence is the greatest gift of all. If you wish to honor us with a gift, we have a registry at Crate & Barrel and a honeymoon fund. Details available upon request.'
              },
              {
                q: 'Are children welcome?',
                a: 'We love your little ones, but we have decided to make our wedding an adults-only celebration. We hope this advance notice allows you to make arrangements.'
              },
              {
                q: 'Where can we stay?',
                a: 'We have room blocks at the Napa Valley Lodge and the Silverado Resort. Booking information and discount codes will be sent with your invitation.'
              },
              {
                q: 'Is the venue wheelchair accessible?',
                a: 'Yes, Rosewood Estate is fully wheelchair accessible with ramps and accessible restrooms throughout the venue.'
              },
              {
                q: 'What if it rains?',
                a: 'We have a beautiful covered pavilion as our backup plan. Rain or shine, our celebration will go on!'
              }
            ].map((faq, i) => (
              <div key={i} className="faq-item bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1" style={{animationDelay: `${i * 0.1}s`}}>
                <h3 className="font-serif text-2xl mb-4 text-gray-800">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="heart-beat mb-8">
            <Heart className="w-12 h-12 mx-auto text-rose-400" fill="currentColor" />
          </div>
          <p className="font-serif text-3xl mb-6 fade-in-up">Thank You</p>
          <div className="divider-line w-16 h-0.5 bg-rose-400 mx-auto mb-8"></div>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto text-lg">
            We are so grateful for your love and support as we begin this new chapter. Your presence means the world to us, and we cannot wait to celebrate with you.
          </p>
          <div className="flex justify-center gap-8 mb-10">
            <a href="#" className="footer-link text-gray-400 hover:text-rose-400 transition-all duration-300 text-sm tracking-widest">Instagram</a>
            <a href="#" className="footer-link text-gray-400 hover:text-rose-400 transition-all duration-300 text-sm tracking-widest">Facebook</a>
            <a href="#" className="footer-link text-gray-400 hover:text-rose-400 transition-all duration-300 text-sm tracking-widest">Email Us</a>
          </div>
          <p className="text-sm text-gray-500 tracking-wide">
            Ira & Angel • June 27, 2026 • #IraAndAngel2026
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          10%, 30% { transform: scale(1.1); }
          20%, 40% { transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes floatingHearts {
          0% {
            opacity: 0;
            transform: translateY(100vh) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) rotate(360deg);
          }
        }

        @keyframes bloom {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.3;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes dividerGrow {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }

        .fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        .fade-in-scale {
          animation: fadeInScale 1.2s ease-out forwards;
          opacity: 0;
        }

        .slide-up {
          animation: slideUp 1s ease-out;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .heart-beat {
          animation: heartBeat 2s ease-in-out infinite;
        }

        .icon-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .floating-heart {
          animation: floatingHearts linear infinite;
        }

        .flower-bloom {
          animation: bloom 6s ease-in-out infinite;
        }

        .divider-line {
          animation: dividerGrow 1s ease-out forwards;
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 3s infinite;
        }

        .section-fade {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .story-card {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
          transition: transform 0.3s ease;
        }

        .story-card:hover {
          transform: translateX(10px);
        }

        .heart-icon-small {
          animation: pulse 2s ease-in-out infinite;
        }

        .detail-card {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .detail-item {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .detail-item:nth-child(1) { animation-delay: 0.1s; }
        .detail-item:nth-child(2) { animation-delay: 0.2s; }
        .detail-item:nth-child(3) { animation-delay: 0.3s; }

        .timeline-item {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .timeline-item:nth-child(1) { animation-delay: 0.1s; }
        .timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .timeline-item:nth-child(3) { animation-delay: 0.3s; }
        .timeline-item:nth-child(4) { animation-delay: 0.4s; }
        .timeline-item:nth-child(5) { animation-delay: 0.5s; }
        .timeline-item:nth-child(6) { animation-delay: 0.6s; }
        .timeline-item:nth-child(7) { animation-delay: 0.7s; }

        .timeline-card {
          transition: all 0.5s ease;
        }

        .timeline-card:hover {
          transform: scale(1.03);
        }

        .timeline-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .gallery-item {
          opacity: 0;
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .party-member {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .party-avatar {
          transition: all 0.5s ease;
        }

        .party-avatar:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .dress-card {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .color-swatch {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .input-group {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .input-group:nth-child(1) { animation-delay: 0.1s; }
        .input-group:nth-child(2) { animation-delay: 0.2s; }
        .input-group:nth-child(3) { animation-delay: 0.3s; }
        .input-group:nth-child(4) { animation-delay: 0.4s; }
        .input-group:nth-child(5) { animation-delay: 0.5s; }
        .input-group:nth-child(6) { animation-delay: 0.6s; }

        .radio-label {
          border-color: rgb(254, 205, 211);
        }

        .radio-label:has(input:checked) {
          background: white;
          border-color: rgb(251, 113, 133);
        }

        .submit-button {
          opacity: 0;
          animation: fadeInScale 0.8s ease-out 0.7s forwards;
        }

        .rsvp-form {
          opacity: 0;
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .download-button {
          opacity: 0;
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .confirm-message {
          animation: fadeInScale 0.5s ease-out;
        }

        .faq-item {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .footer-link {
          position: relative;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: rgb(251, 113, 133);
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .countdown-container {
          opacity: 0;
          animation: fadeInScale 1s ease-out forwards;
        }

        .countdown-box {
          opacity: 0;
          animation: fadeInScale 0.8s ease-out forwards;
          transition: all 0.3s ease;
        }

        .countdown-box:nth-child(1) { animation-delay: 0.1s; }
        .countdown-box:nth-child(2) { animation-delay: 0.2s; }
        .countdown-box:nth-child(3) { animation-delay: 0.3s; }
        .countdown-box:nth-child(4) { animation-delay: 0.4s; }

        .countdown-box:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(251, 113, 133, 0.2);
        }

        .countdown-number {
          animation: pulse 2s ease-in-out infinite;
        }

        input:focus, select:focus, textarea:focus {
          transform: translateY(-2px);
        }

        .letter-spacing h1 {
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
};

export default WeddingWebsite;