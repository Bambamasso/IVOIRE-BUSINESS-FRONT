export default function Footer(){
    return(
        <>
        <footer className="bg-[#2D1606] text-[#E5D5C6] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        
        {/* Colonne Logo & Bio */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
            <span className="bg-[#F2B66D] text-black w-8 h-8 rounded-full flex items-center justify-center">C</span>
            Clothing.
          </div>
          <p className="text-sm leading-relaxed opacity-80 mb-6 max-w-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex gap-4">
            {/* Remplace par tes icônes préférées */}
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition cursor-pointer"></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition cursor-pointer"></div>
            <div className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition cursor-pointer"></div>
          </div>
        </div>

        {/* Liens */}
        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li>About Us</li>
            <li>Blog</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Customer Services</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li>My Account</li>
            <li>Track Your Order</li>
            <li>Return</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact Info</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li>+0123-456-789</li>
            <li>example@gmail.com</li>
            <li>8502 Preston Rd. Inglewood, Maine 98380</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
        <p>Copyright © 2024 Clothing Website Design. All Rights Reserved.</p>
        <div className="flex gap-4">
          <span>English ⌵</span>
          <span>USD ⌵</span>
        </div>
      </div>
    </footer>
        </>
    )
}