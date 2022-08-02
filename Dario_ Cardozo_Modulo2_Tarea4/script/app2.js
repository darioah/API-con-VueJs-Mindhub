// MODO DARK AQUI 
const prereferdColorScheme = window.matchMedia('prefers-color-scheme: dark').matches ? 'dark' : 'light';
const slider = document.getElementById('slider')
const setTheme = (theme) => {
document.documentElement.setAttribute('date-theme', theme)
localStorage.setItem('theme', theme)
}
console.log(setTheme)

slider.addEventListener('click', () => {
let switckToTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
setTheme(switckToTheme)
console.log(switckToTheme)
});
setTheme(localStorage.getItem('theme'|| prereferdColorScheme));
// FIN DEL MODO DARK
 


const { createApp } = Vue

createApp({
  data() {   //variables que va a responder vue
    return {
       list: {
    listMembers: [],
    listMembersH:[],
     listParty: ["R", "D", "ID"],
     listState:"",
    listMembersPCT: [],
  },

  allGlance: {
    democrats: [],
    republicans: [],
    independents: [],
  },
  avorege: {
    democrats: [],
    republicans: "",
    independents: "",
  },

  promedioTotal: "",
  
  leastEngaged: [],
  mostEngaged: [],
  leastLoyalty: [],
  mostLoyalty: [],
  total_D :"",
 total_R :"",
 total_ID :"",

 
 message: 'Hello Vue!' 
}
},

  created(){
    let chamber = ""

    if(document.title === "House" || document.title === "Attendance-House" || document.title === "PartyLoyalty-House"){
        chamber = "house"
    }else if(document.title === "Senate" || document.title === "Attendance-Senate" || document.title === "PartyLoyalty-Senate"){
        chamber = "senate"
    }
  const url = `https://api.propublica.org/congress/v1/117/${chamber}/members.json`
  const key = 'Pjx1bQWAn8gpcAFfQpOVPkjaMAvjCEWDIVcoIBF1'
  const options = {
      method:'GET',
      headers : {
          "X-API-Key": key
      }
  }
      fetch(url,options)
       .then(data => data.json())
      .then(datos => {
       this.list.listMembersH = datos.results[0].members
      this.filterParty(this.list.listMembersH); 
      console.log(this.list.listMembersH)
       this.list.listMembersPCT = Math.ceil(this.list.listMembersH.length * 0.1);

       this.leastLoyalty = this.orderVotes(this.list.listMembersH, "BOTON", "votes_with_party_pct");
       this.mostLoyalty = this.orderVotes(this.list.listMembersH, "TOP", "votes_with_party_pct");
       this.leastEngaged =this.orderVotes(this.list.listMembersH, "TOP", "missed_votes_pct");
       this.mostEngaged = this.orderVotes(this.list.listMembersH, "BOTON", "missed_votes_pct");
       
        
      this.avorege.democrats= this.allGlance.democrats.map((m) => m.votes_with_party_pct || 0)
        .reduce((acumulador, numero) => acumulador + numero,0);
  
      this.avorege.republicans = this.allGlance.republicans.map((m) => m.votes_with_party_pct ||0)
      .reduce((acumulador, numero) => acumulador + numero,0);
         this.avorege.independents = this.allGlance.independents.map((m) => m.votes_with_party_pct ||0 )
      .reduce((acumulador, numero) => acumulador + numero,0);
     console.log( this.avorege.independents )
      this.total_D = Number((this.avorege.democrats/this.allGlance.democrats.length).toFixed(2)) ;
      this.total_R = Number((this.avorege.republicans/this.allGlance.republicans.length).toFixed(2))
      
       
         if (this.allGlance.independents.length > 0 ) {    
          this.total_ID = Number((this.avorege.independents/this.allGlance.independents.length).toFixed(2))
         }else{
          this.total_ID = 0
         }
          let divisor = this.total_ID > 0? 3 : 2   
          this.promedioTotal = Number(((this.total_D+this.total_R + this.total_ID)/divisor).toFixed(2))
          
            
      }  )
      .catch(error=> console.log(error))
  },

  methods:{

    
   filterParty : function(array) {
    
     this.allGlance.democrats = array.filter((member) => member.party === "D");
     this.allGlance.republicans = array.filter((member) => member.party === "R");
     this.allGlance.independents = array.filter((member) => member.party === "ID");
    
},
     orderVotes : function(array, order, property) {
     
  if (order === "BOTON") {
    return array
      .filter((member) => member.total_votes && member.total_votes > 0)
      .sort( (a,b) => {
       
          return b[property] - a[property]
        
      })
      .splice(0, this.list.listMembersPCT);
  }
  if (order === "TOP") {
    return array
      .filter((member) => member.total_votes > 0)
      .sort((a, b) => {
        return a[property] - b[property]
      })
      .splice(0, this.list.listMembersPCT);
    }
},

 },

computed:{
  filterMembers: function(){
   
      if(this.list.listState === ""){
           return this.list.listMembersH.filter(member => this.list.listParty.includes(member.party))
        
      } else{
         
              

          
            return  this.list.listMembersH.filter(member=> this.list.listParty.includes(member.party) && member.state === this.list.listState) 
              

               
      } 
  },
},



}).mount("#listaH")





  






//listMemberS = Array.from(senate.results[0].members);  
//listMembersH = Array.from(house.results[0].members); 

// if( document.title == "Attendance-House" ){
  
 
  
  //this.listMembersPCT = Math.ceil(this.list.listMembersH.length * 0.1);
  
  
   // app.leastEngaged = orderVotes(listMembersH, "TOP", "missed_votes_pct");
    //app.mostEngaged = orderVotes(listMembersH, "BOTON", "missed_votes_pct");

  //   let contenedor = document.getElementById("tabla");
  // let contenedor2 = document.getElementById("tabla_most");
  //   mostrarTabla(this.leastEngaged,contenedor, 'missed_votes','missed_votes_pct' );
  //   mostrarTabla( this.mostEngaged,contenedor2,'missed_votes', 'missed_votes_pct' );
   
  // }
  // else if( document.title === "PartyLoyalty-House"){
  //   this.listMembersPCT = Math.ceil(this.listMembersH.length * 0.1);
  //   this.leastLoyalty = orderVotes(this.listMembersH, "BOTON", "votes_with_party_pct");
  //   this.mostLoyalty = orderVotes(this.listMembersH, "TOP", "votes_with_party_pct");
  //   filterParty(this.listMembersH); 
  //   let contenedor = document.getElementById("tabla");
  //   let contenedor2 = document.getElementById("tabla_most");
  //   mostrarTabla( this.leastLoyalty,contenedor, 'total_votes','votes_with_party_pct' );
  //   mostrarTabla( this.mostLoyalty,contenedor2,'total_votes', 'votes_with_party_pct' );
  // }
  // else if( document.title === "Attendance-Senate" ){
  //   this.listMembersPCT = Math.ceil(this.listMemberS.length * 0.1);
  //   filterParty(this.listMemberS); 
  //   this.leastEngaged = orderVotes(this.listMemberS, "TOP", "missed_votes_pct");
  //   this.mostEngaged = orderVotesthis(this.listMemberS, "BOTON", "missed_votes_pct");
  //   let contenedor = document.getElementById("tabla");
  //   let contenedor2 = document.getElementById("tabla_most");
  //   mostrarTabla( this.leastEngaged,contenedor, 'missed_votes','missed_votes_pct' );
  //   mostrarTabla( this.mostEngaged,contenedor2,'missed_votes', 'missed_votes_pct' );
  // }
//   else if( document.title === "PartyLoyalty-Senate"){
//     this.listMembersPCT = Math.ceil(this.listMemberS.length * 0.1);
//     filterParty(this.listMemberS); 
//     this.leastLoyalty = orderVotes(this.listMemberS, "BOTON", "votes_with_party_pct");
//     this.mostLoyalty = orderVotesthis(this.listMemberS, "TOP", "votes_with_party_pct");
//   let contenedor = document.getElementById("tabla");
//   let contenedor2 = document.getElementById("tabla_most");
//   mostrarTabla( this.leastLoyalty,contenedor, 'total_votes','votes_with_party_pct' );
//   mostrarTabla( this.mostLoyalty,contenedor2,'total_votes', 'votes_with_party_pct' );
//   } 
// mostrarPorcentaje(this.allGlance.democrats);
// mostrarPorcentaje(this.allGlance.republicans);
// mostrarPorcentaje(this.allGlance.independents);


// this.total_D = (this.avorege.democrats/this.allGlance.democrats.length.toFixed(2)) ;
// this.total_R = (Number(this.avorege.republicans) / this.allGlance.republicans.length).toFixed(2)
// this.total_ID
//    if (this.allGlance.independents.length === 0 || !0 ) {    
//     (this.total_ID = this.avorege.independents).toFixed(2)
//    }
//   document.getElementById("prom_D").innerHTML = `${total_D.toFixed(2)}% `;
//   document.getElementById("prom_R").innerHTML = `${total_R.toFixed(2)}%`;
//   document.getElementById("prom_ID").innerHTML = `${total_ID.toFixed(2)}%`;

// let dd = this.allGlance.democrats.length;
// document.getElementById("cantidad").innerHTML = dd;
// let rr = this.allGlance.republicans.length;
// document.getElementById("cantidad_R").innerHTML = rr;
// let id = this.allGlance.independents.length;
// document.getElementById("cantidad_ID").innerHTML = id;
// let total = this.allGlance.democrats.length + app.allGlance.republicans.length +app.allGlance.independents.length
// document.getElementById("total").innerHTML = total;
// let t_pct = (total_D + total_R + total_ID)/3.
// document.getElementById("total_pct").innerHTML = `${t_pct.toFixed(2)}%`;
