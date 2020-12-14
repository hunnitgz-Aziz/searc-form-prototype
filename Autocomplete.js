export default class Autocomplete {
  constructor(rootEl, options = {}) {
    this.rootEl = rootEl;
    this.options = {
      numOfResults: 10,
      data: null
      ,
      onChange: () => {},
      ...options,
    };
    this.init();
  }

    // Get data for the dropdown
    // if there is not data from options then query for data
    // otherwise use data from options to query

    

  async onQueryChange(query) {
    if(!query) return [];
    let results = [];
      
    if(this.options.data) {
      results = await this.options.onChange(query, this.options.data);
    } else {
      results = await this.options.onChange(query);
      
    }

    this.updateDropdown(results.slice(0, this.options.numOfResults));
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();

    results.forEach((result, i) => {
      const el = document.createElement('li');
      var newCount = i + 1;
      el.classList.add('result');
      el.textContent = result.text;
      el.setAttribute("tabindex", ""+newCount+"")

      // Pass the value to the onSelect callback
      el.addEventListener('click', () => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      fragment.appendChild(el);

    });

    
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'search');
    inputEl.setAttribute('name', 'query');
    inputEl.setAttribute('autocomplete', 'off');
    inputEl.setAttribute("value", "")
    inputEl.setAttribute("tabindex", "0")

    inputEl.addEventListener('input',
      event => this.onQueryChange(event.target.value));

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)
    console.log(this.inputEl.value)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    this.listEl.classList.add('results');
    this.rootEl.appendChild(this.listEl);

    

    window.onclick = function(event) {
      if (event.target == document.querySelectorAll('.results')) {
        
      } else {
        
        document.querySelectorAll('.results').forEach(result => {
          result.style.display = 'none'
        })
      }
      
    }


    this.inputEl.addEventListener("focus", (event) => {
      this.inputEl.addEventListener("input", (event) => {
        this.listEl.style.display = 'block';

        document.addEventListener("keydown", (e) => {
          var results = document.querySelectorAll('.results li');
          
          var elem = this.inputEl;
          var currentTabIndex = elem.tabIndex;
          var key = e.key || e.keyCode;
          
          switch (key) {
            case 'ArrowUp': case 38:
              if (document.activeElement == (this.inputEl || results[0])) { break; }
              else { 
                document.activeElement.previousSibling.focus(); 
              }
              break;
            case 'ArrowDown': case 40:
              if(document.activeElement == this.inputEl) {
                results[0].focus();
              } else { 
                document.activeElement.nextSibling.focus(); 
                console.log(document.activeElement.nextSibling)
              }
              break;
            case 'Enter': case 13:
              console.log(document.activeElement)
              this.inputEl.value = document.activeElement.innerHTML
              break;
          }
        })
      })
    })    
  }
}
