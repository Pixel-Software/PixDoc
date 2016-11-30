# /usr/bin/python
#
#==--- DoxyFormat/FetchFiles.sh --------------------------------------------==#
#
# File        : FetchFiles.sh
# Description : Fetches the files required for formatting Pixel's Doxygen
#               documentation.
#
#==-------------------------------------------------------------------------==#

import subprocess, os

def git(*args):
  return subprocess.check_call(['git'] + list(args))

baseUrl =\
  'https://raw.githubusercontent.com/PixelTechnologies/DoxyFormat/master/'

urls = {
  'stylesheet'  : 'Css/pixel.css'     ,
  'header'      : 'Html/header.html'  ,
  'footer'      : 'Html/footer.html'  ,
  'jscript'     : 'Js/DoxyFormat.js'  ,
  'logo_light'  : 'Images/PixelTechnologiesLogoLight.png'
}

os.mkdir('DoxyFormat')
os.chdir('DoxyFormat')

for key, val in urls.items():
  subprocess.call(['wget', '--no-cache', baseUrl + val])
