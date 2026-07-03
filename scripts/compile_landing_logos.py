import os
import subprocess

# Define paths. Resolve relative to the repo root (this script lives in scripts/)
# so it works no matter the current working directory.
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_dir = os.path.join(repo_root, "public", "assets", "images")

# The Square Blue Volumetric SVG
svg_square = """<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Radial Gradient (Deep Navy with Warm Amber/Gold Core Glow) -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#4A3828"/> <!-- Warm Amber Center Glow -->
      <stop offset="45%" stop-color="#0E162C"/> <!-- Deep Sea Navy -->
      <stop offset="100%" stop-color="#060A14"/> <!-- Dark border -->
    </radialGradient>

    <!-- Bezel Ring Gradient (Polished Metallic Blue-Steel) -->
    <linearGradient id="bezelGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E1F5FE"/> <!-- Metallic Ice Blue -->
      <stop offset="50%" stop-color="#0288D1"/> <!-- Cool Water Blue -->
      <stop offset="100%" stop-color="#0D47A1"/> <!-- Deep Blastoise Navy -->
    </linearGradient>

    <!-- Left Chevron Gradient (Polished Metallic Blue-Steel) -->
    <linearGradient id="leftChevronGradient" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
      <stop offset="0%" stop-color="#E1F5FE"/> <!-- Silver-Blue Highlight -->
      <stop offset="40%" stop-color="#00A0E9"/> <!-- Pokémon Blue -->
      <stop offset="100%" stop-color="#0A2F6C"/> <!-- Dark Sea Navy -->
    </linearGradient>

    <!-- Right Chevron Gradient (Polished Metallic Blue-Steel) -->
    <linearGradient id="rightChevronGradient" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
      <stop offset="0%" stop-color="#E1F5FE"/>
      <stop offset="40%" stop-color="#00A0E9"/>
      <stop offset="100%" stop-color="#0A2F6C"/>
    </linearGradient>

    <!-- Pokeball Outer Base Gradient (Dark Navy) -->
    <linearGradient id="pokeballBaseGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A2D4C"/>
      <stop offset="100%" stop-color="#060D1A"/>
    </linearGradient>

    <!-- Pokeball Top Half (Glossy Silver-White) -->
    <linearGradient id="pokeballTopGradient" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#FCFBF7"/>
      <stop offset="100%" stop-color="#D2D7DF"/>
    </linearGradient>

    <!-- Pokeball Bottom Half (Volumetric Pokémon Blue) -->
    <linearGradient id="pokeballBottomGradient" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#40C4FF"/> <!-- Bright Ice Blue highlight -->
      <stop offset="50%" stop-color="#0091EA"/> <!-- Saturated Blue -->
      <stop offset="100%" stop-color="#0D47A1"/> <!-- Deep Navy -->
    </linearGradient>

    <!-- Button Inner Gradient (Warm Gold/White accent - shell reference) -->
    <linearGradient id="buttonInnerGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCFBF7"/>
      <stop offset="100%" stop-color="#F2BC4E"/>
    </linearGradient>

    <!-- Standard Square Clip -->
    <clipPath id="clipSquare">
      <rect width="1024" height="1024" fill="white"/>
    </clipPath>
  </defs>

  <g clip-path="url(#clipSquare)">
    <!-- Background Rect -->
    <rect width="1024" height="1024" fill="url(#bgGradient)"/>
    
    <!-- Outer Bezel Ring (Polished Blue-Steel) -->
    <circle cx="512" cy="512" r="440" stroke="url(#bezelGradient)" stroke-width="24" fill="none"/>
    
    <!-- LEFT CHEVRON (Polished Blue-Steel, Straight Vertical Edge, NO Outline) -->
    <path d="M216 512 L502 273 V751 Z" fill="url(#leftChevronGradient)"/>
    
    <!-- RIGHT CHEVRON (Polished Blue-Steel, Straight Vertical Edge, NO Outline) -->
    <path d="M808 512 L522 273 V751 Z" fill="url(#rightChevronGradient)"/>
    
    <!-- Pokeball Core -->
    <g>
      <!-- Base/Border Circle (Dark Navy) -->
      <circle cx="512" cy="512" r="128" fill="url(#pokeballBaseGradient)"/>
      
      <!-- Top Half (Glossy Silver-White) -->
      <path d="M402 512 A110 110 0 0 1 622 512 Z" fill="url(#pokeballTopGradient)"/>
      
      <!-- Bottom Half (Volumetric Blue) -->
      <path d="M402 512 A110 110 0 0 0 622 512 Z" fill="url(#pokeballBottomGradient)"/>
      
      <!-- Button Outer Ring (Dark Navy with Silver-Blue Stroke) -->
      <circle cx="512" cy="512" r="40" fill="#0A1224" stroke="#E1F5FE" stroke-width="4"/>
      
      <!-- Button Inner Circle (Warm Gold/White) -->
      <circle cx="512" cy="512" r="20" fill="url(#buttonInnerGradient)"/>
      
      <!-- Button Highlight -->
      <circle cx="502" cy="502" r="6" fill="#FFFFFF" opacity="0.8"/>
    </g>
  </g>
</svg>"""

# The Pre-Rounded/Squircle Blue Volumetric SVG
svg_rounded = """<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Radial Gradient (Deep Navy with Warm Amber/Gold Core Glow) -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#4A3828"/> <!-- Warm Amber Center Glow -->
      <stop offset="45%" stop-color="#0E162C"/> <!-- Deep Sea Navy -->
      <stop offset="100%" stop-color="#060A14"/> <!-- Dark border -->
    </radialGradient>

    <!-- Bezel Ring Gradient (Polished Metallic Blue-Steel) -->
    <linearGradient id="bezelGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E1F5FE"/> <!-- Metallic Ice Blue -->
      <stop offset="50%" stop-color="#0288D1"/> <!-- Cool Water Blue -->
      <stop offset="100%" stop-color="#0D47A1"/> <!-- Deep Blastoise Navy -->
    </linearGradient>

    <!-- Left Chevron Gradient (Polished Metallic Blue-Steel) -->
    <linearGradient id="leftChevronGradient" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
      <stop offset="0%" stop-color="#E1F5FE"/> <!-- Silver-Blue Highlight -->
      <stop offset="40%" stop-color="#00A0E9"/> <!-- Pokémon Blue -->
      <stop offset="100%" stop-color="#0A2F6C"/> <!-- Dark Sea Navy -->
    </linearGradient>

    <!-- Right Chevron Gradient (Polished Metallic Blue-Steel) -->
    <linearGradient id="rightChevronGradient" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
      <stop offset="0%" stop-color="#E1F5FE"/>
      <stop offset="40%" stop-color="#00A0E9"/>
      <stop offset="100%" stop-color="#0A2F6C"/>
    </linearGradient>

    <!-- Pokeball Outer Base Gradient (Dark Navy) -->
    <linearGradient id="pokeballBaseGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A2D4C"/>
      <stop offset="100%" stop-color="#060D1A"/>
    </linearGradient>

    <!-- Pokeball Top Half (Glossy Silver-White) -->
    <linearGradient id="pokeballTopGradient" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#FCFBF7"/>
      <stop offset="100%" stop-color="#D2D7DF"/>
    </linearGradient>

    <!-- Pokeball Bottom Half (Volumetric Pokémon Blue) -->
    <linearGradient id="pokeballBottomGradient" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#40C4FF"/> <!-- Bright Ice Blue highlight -->
      <stop offset="50%" stop-color="#0091EA"/> <!-- Saturated Blue -->
      <stop offset="100%" stop-color="#0D47A1"/> <!-- Deep Navy -->
    </linearGradient>

    <!-- Button Inner Gradient (Warm Gold/White accent - shell reference) -->
    <linearGradient id="buttonInnerGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FCFBF7"/>
      <stop offset="100%" stop-color="#F2BC4E"/>
    </linearGradient>

    <!-- Squircle Clip Path -->
    <clipPath id="clipSquircle">
      <rect width="1024" height="1024" rx="224" ry="224" fill="white"/>
    </clipPath>
  </defs>

  <!-- Apply the Squircle clip to everything -->
  <g clip-path="url(#clipSquircle)">
    <!-- Background Rect -->
    <rect width="1024" height="1024" fill="url(#bgGradient)"/>
    
    <!-- Outer Bezel Ring (Polished Blue-Steel) -->
    <circle cx="512" cy="512" r="440" stroke="url(#bezelGradient)" stroke-width="24" fill="none"/>
    
    <!-- LEFT CHEVRON (Polished Blue-Steel) -->
    <path d="M216 512 L502 273 V751 Z" fill="url(#leftChevronGradient)"/>
    
    <!-- RIGHT CHEVRON (Polished Blue-Steel) -->
    <path d="M808 512 L522 273 V751 Z" fill="url(#rightChevronGradient)"/>
    
    <!-- Pokeball Core -->
    <g>
      <!-- Base/Border Circle (Dark Navy) -->
      <circle cx="512" cy="512" r="128" fill="url(#pokeballBaseGradient)"/>
      
      <!-- Top Half (Glossy Silver-White) -->
      <path d="M402 512 A110 110 0 0 1 622 512 Z" fill="url(#pokeballTopGradient)"/>
      
      <!-- Bottom Half (Volumetric Blue) -->
      <path d="M402 512 A110 110 0 0 0 622 512 Z" fill="url(#pokeballBottomGradient)"/>
      
      <!-- Button Outer Ring (Dark Navy with Silver-Blue Stroke) -->
      <circle cx="512" cy="512" r="40" fill="#0A1224" stroke="#E1F5FE" stroke-width="4"/>
      
      <!-- Button Inner Circle (Warm Gold/White) -->
      <circle cx="512" cy="512" r="20" fill="url(#buttonInnerGradient)"/>
      
      <!-- Button Highlight -->
      <circle cx="502" cy="502" r="6" fill="#FFFFFF" opacity="0.8"/>
    </g>
  </g>
</svg>"""

# Write temporary SVGs (in the repo root, cleaned up at the end)
temp_square = os.path.join(repo_root, "temp_square.svg")
temp_rounded = os.path.join(repo_root, "temp_rounded.svg")
with open(temp_square, "w") as f:
    f.write(svg_square)
with open(temp_rounded, "w") as f:
    f.write(svg_rounded)

# Compile to PNG targets. check=True so a sips failure aborts loudly instead of
# silently reporting success; each output is then verified to be non-empty.
targets = [
    ("appicon.png", temp_square),
    ("icon.png", temp_square),
    ("large-logo.png", temp_square),
    ("current_logo_rounded.png", temp_rounded),
]
try:
    for out_name, src in targets:
        out_path = os.path.join(target_dir, out_name)
        print(f"Compiling landing page {out_name}...")
        subprocess.run(["sips", "-s", "format", "png", src, "--out", out_path], check=True)
        if not os.path.exists(out_path) or os.path.getsize(out_path) == 0:
            raise RuntimeError(f"sips produced no output for {out_name}")
finally:
    # Clean up temporary SVGs even if a conversion failed
    for tmp in (temp_square, temp_rounded):
        if os.path.exists(tmp):
            os.remove(tmp)

print("All landing page branding assets compiled successfully!")
