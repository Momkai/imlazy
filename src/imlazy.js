const selector = `[data-imlazy]`
const properties = { root: null, rootMargin: `0px 0px`, threshold: 0 }
const domElement = document

export default class ImLazy {
  constructor (options = { selector, properties, domElement }) {
    // Check selector for media items
    this.selector = Object.assign(selector, options.selector)
    
    // Passed Intersection Observer properties
    this.properties = Object.assign(properties, options.properties)
    
    // Dom  element passed on options
    this.domElement = Object.assign(domElement, options.domElement)
    
    // Get a DOM element to observe media elements
    this.elements = this.domElement.querySelectorAll(this.selector)
  }
  
  init () {
    // We need support for IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      console.log(`You need to install a pollyfill! :(`)
    } else {
      this.io = new IntersectionObserver((entries) => {
        this.onIntersection(entries)
      }, this.properties)
      
      this.elements.forEach((element) => {
        this.io.observe(element)
      })
    }
  }
  
  onIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target

      console.log(element)
      console.log(entry)
      console.log('--')
      
      if (entry.isIntersecting && !element.hasAttribute('data-imlazy-loaded')) {
        this.preload(element)
        // this.io.unobserve(element)
      }
    })
  }
  
  preload (element) {
    // Gets all sources element that need to be loaded
    // Converted to Array so element itself can be added to this list
    let sources = Array.from(element.querySelectorAll('source, img'))
    
    // Added element itself to nodelist
    sources[sources.length + 1] = element
    
    sources.forEach((el) => {
      if (el.hasAttribute('data-srcset') && !el.hasAttribute('srcset')) {
        el.setAttribute('srcset', el.getAttribute('data-srcset'))
      }
      
      if (el.hasAttribute('data-src') && !el.hasAttribute('src')) {
        el.setAttribute('src', el.getAttribute('data-src'))
      }
    })
    
    // If the video has playinline it will not play
    // more: https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
    if(element.nodeName === 'VIDEO') {
      element.load()
    }
    
    element.setAttribute('data-imlazy-loaded', true)
  }
}
