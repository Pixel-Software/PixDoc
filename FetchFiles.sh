#==--- DoxyFormat/FetchFiles.sh --------------------------------------------==#
#
# File        : FetchFiles.sh
# Description : Fetches the files required for formatting Pixel's Doxygen
#               documentation.
#
#==-------------------------------------------------------------------------==#

STYLESHEET_URL=https://raw.githubusercontent.com/PixelTechnologies/DoxyFormat/master/Css/pixel.css
HEADER_URL=https://raw.githubusercontent.com/PixelTechnologies/DoxyFormat/master/Html/header.html
FOOTER_URL=https://raw.githubusercontent.com/PixelTechnologies/DoxyFormat/master/Html/footer.html
JSCRIPT_URL=https://raw.githubusercontent.com/PixelTechnologies/DoxyFormat/master/Js/DoxyFormat.js
LOGO_LIGHT_URL=https://raw.githubusercontent.com/PixelTechnologies/DoxyFormat/master/Images/PixelTechnologiesLogoLight.png

wget $STYLESHEET_URL
wget $HEADER_URL
wget $FOOTER_URL
wget $JSCRIPT_URL
wget $LOGO_LIGHT_URL
