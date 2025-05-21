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
        <!-- Macro Capsule Selection Screen -->
        <div id="capsule-selection-screen" class="h-full bg-light flex flex-col">
            <!-- Header -->
            <div id="header" class="px-6 pt-12 pb-4 bg-white shadow-sm">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button class="w-10 h-10 rounded-full bg-light flex items-center justify-center">
                            <i class="fa-solid fa-arrow-left text-primary"></i>
                        </button>
                        <h1 class="text-xl font-bold text-dark">Life Categories</h1>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="w-10 h-10 rounded-full bg-light flex items-center justify-center">
                            <i class="fa-solid fa-search text-primary"></i>
                        </button>
                        <button class="w-10 h-10 rounded-full bg-light flex items-center justify-center relative">
                            <i class="fa-solid fa-bell text-primary"></i>
                            <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full"></span>
                        </button>
                    </div>
                </div>
                <p class="text-gray-500 text-sm mt-1">Select a category to explore or create memories</p>
            </div>
            
            <!-- View Toggle -->
            <div id="view-toggle" class="px-6 py-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <button class="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium">
                        <i class="fa-solid fa-grip text-xs mr-1.5"></i>Grid
                    </button>
                    <button class="px-3 py-1.5 rounded-lg bg-light text-dark text-sm font-medium">
                        <i class="fa-solid fa-list text-xs mr-1.5"></i>List
                    </button>
                </div>
                <div>
                    <button class="px-3 py-1.5 rounded-lg bg-light text-dark text-sm font-medium">
                        <i class="fa-solid fa-filter text-xs mr-1.5"></i>Filter
                    </button>
                </div>
            </div>
            
            <!-- Capsule Grid -->
            <div id="capsule-grid" class="px-6 py-2 flex-1 overflow-y-auto">
                <div class="grid grid-cols-2 gap-4">
                    <!-- Childhood Capsule -->
                    <div id="childhood-capsule" class="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div class="h-24 bg-primary/10 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <i class="fa-solid fa-child text-primary text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-dark">Childhood</h3>
                            <p class="text-xs text-gray-500 mt-1">Early memories and formative experiences</p>
                            <div class="flex items-center mt-3">
                                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary rounded-full" style="width: 35%"></div>
                                </div>
                                <span class="text-xs text-primary font-medium ml-2">35%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Education Capsule -->
                    <div id="education-capsule" class="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div class="h-24 bg-secondary/10 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                <i class="fa-solid fa-graduation-cap text-secondary text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-dark">Education</h3>
                            <p class="text-xs text-gray-500 mt-1">School years and learning journeys</p>
                            <div class="flex items-center mt-3">
                                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-secondary rounded-full" style="width: 65%"></div>
                                </div>
                                <span class="text-xs text-secondary font-medium ml-2">65%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Career Capsule -->
                    <div id="career-capsule" class="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div class="h-24 bg-accent/10 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                                <i class="fa-solid fa-briefcase text-accent text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-dark">Career</h3>
                            <p class="text-xs text-gray-500 mt-1">Professional milestones and work life</p>
                            <div class="flex items-center mt-3">
                                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-accent rounded-full" style="width: 50%"></div>
                                </div>
                                <span class="text-xs text-accent font-medium ml-2">50%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Family Capsule -->
                    <div id="family-capsule" class="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div class="h-24 bg-primary/10 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <i class="fa-solid fa-house-chimney-user text-primary text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-dark">Family</h3>
                            <p class="text-xs text-gray-500 mt-1">Relationships and family moments</p>
                            <div class="flex items-center mt-3">
                                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-primary rounded-full" style="width: 75%"></div>
                                </div>
                                <span class="text-xs text-primary font-medium ml-2">75%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Travel Capsule -->
                    <div id="travel-capsule" class="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div class="h-24 bg-secondary/10 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                <i class="fa-solid fa-plane text-secondary text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-dark">Travel</h3>
                            <p class="text-xs text-gray-500 mt-1">Adventures and places visited</p>
                            <div class="flex items-center mt-3">
                                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-secondary rounded-full" style="width: 20%"></div>
                                </div>
                                <span class="text-xs text-secondary font-medium ml-2">20%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Milestones Capsule -->
                    <div id="milestones-capsule" class="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div class="h-24 bg-accent/10 flex items-center justify-center">
                            <div class="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                                <i class="fa-solid fa-trophy text-accent text-2xl"></i>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-dark">Milestones</h3>
                            <p class="text-xs text-gray-500 mt-1">Life-changing events and achievements</p>
                            <div class="flex items-center mt-3">
                                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-accent rounded-full" style="width: 40%"></div>
                                </div>
                                <span class="text-xs text-accent font-medium ml-2">40%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Create Custom Capsule -->
                <div id="create-custom-capsule" class="mt-4 mb-24">
                    <button class="w-full bg-white border-2 border-dashed border-primary/30 rounded-2xl py-5 flex flex-col items-center justify-center">
                        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <i class="fa-solid fa-plus text-primary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-primary">Create Custom Capsule</h3>
                        <p class="text-xs text-gray-500 mt-1">Design a category that's unique to you</p>
                    </button>
                </div>
            </div>
            
            <!-- Bottom Navigation -->
            <div id="bottom-nav" class="absolute bottom-0 left-0 right-0 bg-white shadow-lg px-6 pt-4 pb-8 rounded-t-3xl">
                <div class="flex justify-between items-center">
                    <span class="flex flex-col items-center cursor-pointer">
                        <div class="w-12 h-12 rounded-full bg-light flex items-center justify-center">
                            <i class="fa-solid fa-house-chimney text-gray-400"></i>
                        </div>
                        <span class="text-xs text-gray-400 mt-1">Home</span>
                    </span>
                    <span class="flex flex-col items-center cursor-pointer">
                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <i class="fa-solid fa-layer-group text-primary"></i>
                        </div>
                        <span class="text-xs text-primary font-medium mt-1">Capsules</span>
                    </span>
                    <span class="flex flex-col items-center relative cursor-pointer">
                        <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center -mt-8 shadow-lg shadow-primary/30">
                            <i class="fa-solid fa-plus text-white text-xl"></i>
                        </div>
                        <span class="text-xs text-gray-400 mt-1">Create</span>
                    </span>
                    <span class="flex flex-col items-center cursor-pointer">
                        <div class="w-12 h-12 rounded-full bg-light flex items-center justify-center">
                            <i class="fa-solid fa-calendar-days text-gray-400"></i>
                        </div>
                        <span class="text-xs text-gray-400 mt-1">Timeline</span>
                    </span>
                    <span class="flex flex-col items-center cursor-pointer">
                        <div class="w-12 h-12 rounded-full bg-light flex items-center justify-center">
                            <i class="fa-solid fa-user text-gray-400"></i>
                        </div>
                        <span class="text-xs text-gray-400 mt-1">Profile</span>
                    </span>
                </div>
            </div>
        </div>
    </div>

</body></html>
