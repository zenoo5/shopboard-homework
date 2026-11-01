const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const elements=new Map();function el(id){if(!elements.has(id))elements.set(id,{value:id==='sort'?'featured':'',innerHTML:'',textContent:'',style:{},dataset:{},classList:{toggle(){}},addEventListener(){},setAttribute(){},showModal(){this.open=true},close(){this.open=false},scrollIntoView(){}});return elements.get(id)}
const disk=new Map();const sandbox={document:{getElementById:el,querySelectorAll(){return []},addEventListener(){}},localStorage:{getItem:k=>disk.get(k)||null,setItem:(k,v)=>disk.set(k,v)},setTimeout(){},clearTimeout(){}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);let count=0;function check(code){vm.runInContext(code,sandbox);count++}
sandbox.assert=assert;
check("assert.equal(filteredGames().length,8)");
check("$('search').value='NEON';assert.equal(filteredGames()[0].name,'Neon Protocol');$('search').value=''");
check("genre='Indie';assert.equal(filteredGames().length,2);genre='All games'");
check("view='sale';assert.equal(filteredGames().length,4);view='all'");
check("$('sort').value='low';assert.equal(filteredGames()[0].price,1299);$('sort').value='high';assert.equal(filteredGames()[0].price,3999)");
check("add(1);add(1);add(2);assert.equal(cart.length,2);renderCart();assert.equal($('total').textContent,'$54.98');assert.equal($('checkout').disabled,false)");
check("wishes=[4];view='wishlist';assert.equal(filteredGames().length,1);assert.equal(filteredGames()[0].id,4)");
check("$('search').value='no such game';render();assert.ok($('grid').innerHTML.includes('No games found'));$('search').value=''");
check("showDetails(1);assert.equal($('detail-dialog').open,true);assert.ok($('details').innerHTML.includes('Echoes of the Wild'))");
check("$('checkout').onclick();assert.equal($('order-dialog').open,true);assert.ok($('order-items').innerHTML.includes('$54.98'))");
check("cart=[];renderCart();assert.equal($('checkout').disabled,true);assert.equal($('total').textContent,'$0.00')");
check("localStorage.setItem('bad','{}');assert.equal(restore('bad').length,0);localStorage.setItem('bad','[1,1,999]');assert.equal(restore('bad').length,1)");
const html=fs.readFileSync('dist/index.html','utf8');for(const resource of ['style.css','app.js'])assert.ok(fs.existsSync('dist/'+resource));for(const match of fs.readFileSync('dist/app.js','utf8').matchAll(/\$\('([^']+)'\)/g)){assert.ok(html.includes('id="'+match[1]+'"'),'Missing HTML ID: '+match[1])}
console.log(`${count} functional checks passed; all referenced DOM IDs and local assets exist. Browser visual QA unavailable.`);

