import './style.css'

// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}


// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Nazionality =
  | 'American'
  | 'British'
  | 'Australian'
  | 'Israeli-American'
  | 'South African'
  | 'French'
  | 'Indian'
  | 'Israeli'
  | 'Spanish'
  | 'South Korean'
  | 'Chinese'

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: Nazionality
}


// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

function isActress(data: unknown): data is Person {

  if (
    data &&
    data instanceof Object &&
    data !== null &&

    'id' in data &&
    typeof data.id === 'number' &&

    'name' in data &&
    typeof data.name === 'string' &&

    'birth_year' in data &&
    typeof data.birth_year === 'number' &&

    'death_year' in data &&
    typeof data.death_year === 'number' &&

    'biography' in data &&
    typeof data.biography === 'string' &&

    'image' in data &&
    typeof data.image === 'string' &&

    'most_famous_movies' in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(m => typeof m === 'string') &&

    'nationality' in data &&
    typeof data.nationality === 'string'

  ) {
    return true
  }

  return false
}

async function getActress(id: number): Promise<Actress | null> {

  try {
    const res = await fetch(` https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`)

    if (!res.ok) {
      throw new Error('Errore nel recupero dei dati')
    }

    const data: object = await res.json();

    if (!isActress(data)) {
      throw new Error('Formato dati non valido')
    }

    return data as Actress

  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore:', err.message)

    } else {
      console.error('Errore generico:', err);
    }
    return null;
  }

}