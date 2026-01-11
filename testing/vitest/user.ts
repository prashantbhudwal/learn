export function createUser(name: string, age: number) {
  return {
    name,
    age,
    id: 1
  };
}

export async function fetchUser(id: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John Doe' });
    }, 500);
  });
}
