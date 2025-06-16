
const TestimonialSection = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-50">
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px]" style={{
        backgroundImage: "url('/lovable-uploads/f40f684e-643d-4161-be1c-240737966a76.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="relative z-10 px-12 py-16 flex items-center min-h-[300px]">
          {/* Text positioned on the left, using more of the image space */}
          <div className="max-w-lg">
            <blockquote className="text-3xl font-normal leading-tight text-left" style={{
              color: '#1F3A8A',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              "Ik zag mezelf niet ineens<br />
              die switch maken, maar<br />
              wat ben ik blij dat ik het<br />
              gedaan heb!"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
