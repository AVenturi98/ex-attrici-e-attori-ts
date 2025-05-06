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


// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET https://boolean-spec-frontend.vercel.app/freetestapi/actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.

async function getAllActresses(): Promise<Actress[]> {

  try {
    const res = await fetch('https://boolean-spec-frontend.vercel.app/freetestapi/actresses');

    if (!res.ok) {
      throw new Error(`Errore ${res.status} nel recupero dei dati: ${res.statusText}`)
    }

    const data: unknown = await res.json();

    if (
      !data ||
      !(data instanceof Array)
    ) {
      throw new Error('Errore recupero dati')
    }

    const actressesValid = data.filter(isActress);

    return actressesValid as Actress[]

  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore:', err.message)

    } else {
      console.error('Errore generico:', err);
    }
    return [];
  }
}


// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id));

    const actresses = await Promise.all(promises);

    return actresses

  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore:', err.message)

    } else {
      console.error('Errore generico:', err);
    }
    return [];
  }
}


// 🎯 BONUS 1
// Crea le funzioni:

// createActress
// updateActress
// Utilizza gli Utility Types:

// Omit: per creare un'attrice senza passare id, che verrà generato casualmente.
// Partial: per permettere l’aggiornamento di qualsiasi proprietà tranne id e name.

const randomID = (): number => Math.floor(Math.random() * 10);

function createActress(dati: Omit<Actress, 'id'>): Actress {
  return { id: randomID(), ...dati }
}

function updateActress(
  newActress: Actress,
  update: Partial<Omit<Actress, 'id' | 'name'>>
): Actress {
  return { ...newActress, ...update }
}