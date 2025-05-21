<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script> window.FontAwesomeConfig = { autoReplaceSvg: 'nest'};</script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <style>::-webkit-scrollbar { display: none;}</style>
    
    <script>
        tailwind.config = {
  "theme": {
    "extend": {
      "colors": {
        "primary": "#7C67CB",
        "secondary": "#F5B0CB",
        "accent": "#FFD166",
        "light": "#F9F7FF",
        "dark": "#3D3A50"
      },
      "fontFamily": {
        "sans": [
          "Nunito",
          "sans-serif"
        ]
      }
    },
    "fontFamily": {
      "sans": [
        "Inter",
        "sans-serif"
      ]
    }
  }
};</script>
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;500;600;700;800;900&amp;display=swap" /><style>
      body {
        font-family: 'Inter', sans-serif !important;
      }
      
      /* Preserve Font Awesome icons */
      .fa, .fas, .far, .fal, .fab {
        font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands" !important;
      }
    </style><style>
  .highlighted-section {
    outline: 2px solid #3F20FB;
    background-color: rgba(63, 32, 251, 0.1);
  }

  .edit-button {
    position: absolute;
    z-index: 1000;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  html, body {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  </style></head>
<body class="font-sans bg-light text-dark">
    <div id="mobile-container" class="max-w-md mx-auto h-[844px] bg-white relative overflow-hidden shadow-xl rounded-3xl">
        <!-- Profile Customization Screen -->
        <div id="profile-customization-screen" class="h-full bg-white px-6 py-8 flex flex-col">
            <!-- Header -->
            <div id="header" class="flex justify-between items-center mb-6">
                <button id="back-button" class="w-10 h-10 flex items-center justify-center text-dark">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 class="text-xl font-bold text-dark">Customize Profile</h1>
                <div class="w-10"></div> <!-- Empty div for spacing -->
            </div>
            
            <!-- Progress indicator -->
            <div id="progress-indicator" class="mb-6">
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full" style="width: 75%"></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Details</span>
                    <span class="text-primary font-medium">Customize</span>
                    <span>Complete</span>
                </div>
            </div>
            
            <!-- Interest Selection -->
            <div id="interest-selection" class="mb-6">
                <h2 class="text-lg font-semibold mb-3">Select Your Interests</h2>
                <p class="text-sm text-gray-600 mb-4">Choose topics you'd like to capture memories about</p>
                
                <div class="grid grid-cols-3 gap-3">
                    <div id="interest-travel" class="interest-category flex flex-col items-center">
                        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-2 relative">
                            <i class="fa-solid fa-plane text-primary text-xl"></i>
                            <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <i class="fa-solid fa-check text-white text-xs"></i>
                            </div>
                        </div>
                        <span class="text-xs font-medium">Travel</span>
                    </div>
                    
                    <div id="interest-family" class="interest-category flex flex-col items-center">
                        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-2 relative">
                            <i class="fa-solid fa-users text-primary text-xl"></i>
                            <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <i class="fa-solid fa-check text-white text-xs"></i>
                            </div>
                        </div>
                        <span class="text-xs font-medium">Family</span>
                    </div>
                    
                    <div id="interest-career" class="interest-category flex flex-col items-center">
                        <div class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
                            <i class="fa-solid fa-briefcase text-gray-400 text-xl"></i>
                        </div>
                        <span class="text-xs font-medium text-gray-400">Career</span>
                    </div>
                    
                    <div id="interest-education" class="interest-category flex flex-col items-center">
                        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-2 relative">
                            <i class="fa-solid fa-graduation-cap text-primary text-xl"></i>
                            <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <i class="fa-solid fa-check text-white text-xs"></i>
                            </div>
                        </div>
                        <span class="text-xs font-medium">Education</span>
                    </div>
                    
                    <div id="interest-hobbies" class="interest-category flex flex-col items-center">
                        <div class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
                            <i class="fa-solid fa-palette text-gray-400 text-xl"></i>
                        </div>
                        <span class="text-xs font-medium text-gray-400">Hobbies</span>
                    </div>
                    
                    <div id="interest-health" class="interest-category flex flex-col items-center">
                        <div class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-2">
                            <i class="fa-solid fa-heart-pulse text-gray-400 text-xl"></i>
                        </div>
                        <span class="text-xs font-medium text-gray-400">Health</span>
                    </div>
                </div>
            </div>
            
            <!-- Privacy Settings -->
            <div id="privacy-settings" class="mb-6">
                <h2 class="text-lg font-semibold mb-3">Privacy Defaults</h2>
                <p class="text-sm text-gray-600 mb-4">Choose your default sharing preferences</p>
                
                <div class="space-y-4">
                    <div id="privacy-private" class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <i class="fa-solid fa-lock text-primary"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold">Private</h3>
                                <p class="text-xs text-gray-500">Only you can view</p>
                            </div>
                        </div>
                        <div class="w-12 h-6 bg-primary rounded-full relative">
                            <div class="w-5 h-5 bg-white rounded-full absolute right-1 top-0.5 shadow-md"></div>
                        </div>
                    </div>
                    
                    <div id="privacy-shareable" class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <i class="fa-solid fa-link text-gray-400"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-500">Shareable</h3>
                                <p class="text-xs text-gray-500">Share via private link</p>
                            </div>
                        </div>
                        <div class="w-12 h-6 bg-gray-200 rounded-full relative">
                            <div class="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 shadow-md"></div>
                        </div>
                    </div>
                    
                    <div id="privacy-public" class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <i class="fa-solid fa-globe text-gray-400"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-500">Public</h3>
                                <p class="text-xs text-gray-500">Anyone can view</p>
                            </div>
                        </div>
                        <div class="w-12 h-6 bg-gray-200 rounded-full relative">
                            <div class="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 shadow-md"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Theme Selection -->
            <div id="theme-selection" class="mb-8">
                <h2 class="text-lg font-semibold mb-3">Choose Your Theme</h2>
                <p class="text-sm text-gray-600 mb-4">Select a color theme for your experience</p>
                
                <div class="flex justify-between mb-4">
                    <div id="theme-lavender" class="theme-option flex flex-col items-center">
                        <div class="w-14 h-14 rounded-full bg-primary border-4 border-primary flex items-center justify-center mb-1">
                            <i class="fa-solid fa-check text-white"></i>
                        </div>
                        <span class="text-xs font-medium">Lavender</span>
                    </div>
                    
                    <div id="theme-ocean" class="theme-option flex flex-col items-center">
                        <div class="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mb-1"></div>
                        <span class="text-xs font-medium text-gray-500">Ocean</span>
                    </div>
                    
                    <div id="theme-forest" class="theme-option flex flex-col items-center">
                        <div class="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-1"></div>
                        <span class="text-xs font-medium text-gray-500">Forest</span>
                    </div>
                    
                    <div id="theme-sunset" class="theme-option flex flex-col items-center">
                        <div class="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center mb-1"></div>
                        <span class="text-xs font-medium text-gray-500">Sunset</span>
                    </div>
                </div>
                
                <!-- Theme Preview -->
                <div id="theme-preview" class="w-full h-28 bg-light rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <i class="fa-solid fa-user text-primary"></i>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold">Preview</span>
                            <span class="text-xs text-gray-500">Lavender theme selected</span>
                        </div>
                    </div>
                    <div class="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <i class="fa-solid fa-plus text-white text-xs"></i>
                    </div>
                </div>
            </div>
            
            <!-- Complete Profile Button -->
            <div id="complete-profile-button" class="mt-auto">
                <button class="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center">
                    Complete Profile
                    <i class="fa-solid fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </div>

</body></html>
