/**
 * main entry
 */
function main () {
	logseq.App.showMsg('Dictionary ready!')
	logseq.Editor.createPage('Dictionary')
	logseq.Editor.onInputSelectionEnd((e) => {
	  const { x, y } = e.point
	  const dsl = (text) => {
		return {
		  key: 'selection-end-text-dialog',
		  close: 'outside',
		  template: `
		  <div style="padding: 10px; overflow: auto;">
			<h3>${text}</h3>
		  </div>
		`,
		  style: {
			left: x + 'px',
			top: y + 'px',
			width: '300px',
			backgroundColor: 'var(--ls-primary-background-color)',
			color: 'var(--ls-primary-text-color)',
			boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
		  },
		  attrs: {
			title: e.text,
		  },
		}
	  }
  
	  logseq.provideUI(dsl('Loading...'))
  
	  async function fetchWordDefinition(word){
		try {
		  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
		  if (!response.ok) {
			logseq.provideUI(dsl('ERROR from fetch'));
		  }
		  const data = await response.json();
		  console.log(data);
		  return data
		} catch (error) {
		  logseq.provideUI(dsl('Error:'+ error));
		}
	  }
	  fetchWordDefinition(e.text).then((res) => {
		logseq.provideUI(dsl(res[0].meanings[0].definitions[0].definition))
		logseq.Editor.appendBlockInPage('Dictionary','## ' + e.text + '\n**definition**\n'+ res[0].meanings[0].definitions[0].definition + 
		'\n\n**synonyms**\n' + res[0].meanings[0].synonyms);
	  }).catch((error) => {
		logseq.provideUI(dsl('ERROR' + error))
		console.error(e)
	  })
	})
  }
  
  // bootstrap
  logseq.ready(main).catch(console.error)
  