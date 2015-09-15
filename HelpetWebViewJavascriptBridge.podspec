
Pod::Spec.new do |s|

  s.name         = "HelpetWebViewJavascriptBridge"
  s.version      = "0.0.1"
  s.summary      = "fork fro HelpetWebViewJavascriptBridge"

  s.description  = <<-DESC
                   A longer description of HelpetWebViewJavascriptBridge in Markdown format.

                   * Think: Why did you write this? What is the focus? What does it do?
                   * CocoaPods will be using this to generate tags, and improve search results.
                   * Try to keep it short, snappy and to the point.
                   * Finally, don't worry about the indent, CocoaPods strips it!
                   DESC

  s.homepage     = "http://lijinchao.sinaapp.com"
  s.license      = "MIT"
  s.author             = { "ljc" => "lijinchao2007@163.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/PodRepo/HelpetWebViewJavascriptBridge.git", :tag => s.version }

  s.source_files  = "Classes/**/*.{h,m}"
  #s.exclude_files = "Classes/Exclude"

  # s.public_header_files = "Classes/**/*.h"
  s.resources = "Resources/*"

  #s.frameworks        = "AVFoundation"
  #s.library = 'c++'
  # s.library   = "iconv"
  # s.libraries = "iconv", "xml2"


  s.requires_arc = true

  # s.xcconfig = { "HEADER_SEARCH_PATHS" => "$(SDKROOT)/usr/include/libxml2" }
  # s.dependency "JSONKit", "~> 1.4"

  #s.dependency "pop", '~> 1.0.7'

end
