import './StatReseau.css'

function StatReseau({lignes}){

  const lignesTotal = lignes.length;

  let arretsTotal = 0;
  let ligneMax = lignes[0];
  for (let i = 0; i < lignes.length; i++) {
    arretsTotal += lignes[i].arrets;

    if (lignes[i].arrets > ligneMax.arrets) {
      ligneMax = lignes[i];
    }
  }


  return(
    <div className='statReseau'>
      <p>Nombre total de lignes : {lignesTotal}</p>
      <p>Nombre total d'arrets : {arretsTotal}</p>
      <p>Ligne ayant le plus d'arrets : {ligneMax.numero} avec {ligneMax.arrets} arrêts</p>
    </div>
  );
}

export default StatReseau;