import { useState , useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, runTransaction ,onValue} from 'firebase/database';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const Menu = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Pizza', price: 10, quantity: 0 },
    { id: 2, name: 'Burger', price: 5, quantity: 0 },
    { id: 3, name: 'Fries', price: 3, quantity: 0 },
  ]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // listen for changes to the authenticated user's balance value
    if (auth.currentUser) {
      const balanceRef = ref(db, `users/${auth.currentUser.uid}/balance`);
      const unsubscribe = onValue(balanceRef, (snapshot) => {
        setBalance(snapshot.val() || 0);
      });
      return () => {
        unsubscribe(); // unsubscribe from real-time updates on unmount
      };
    }
  }, [auth.currentUser, db]);

  const handleOrder = async () => {
    try {
      if (!auth.currentUser) {
        console.log('No user is currently signed in.');
        return;
      }
      
      await runTransaction(ref(db, `users/${auth.currentUser.uid}/balance`), (balanceData) => {
        console.log('Current balance:', balanceData);
        if (balanceData) {
          // balanceData -= balance;
          balanceData -= items.reduce((total, item) => total + item.price * item.quantity, 0);

        }
        return balanceData;
      });

      items.forEach(async (item) => {
        if (item.quantity > 0) {
          await runTransaction(ref(db, `items/${item.id}/quantity`), (itemData) => {
            if (itemData) {
              itemData -= item.quantity;
            }
            return itemData;
          });
        }
      });

      console.log('Order placed successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>${item.price}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(event) =>
                setItems((prevItems) =>
                  prevItems.map((prevItem) => {
                    if (prevItem.id === item.id) {
                      return { ...prevItem, quantity: parseInt(event.target.value) };
                    }
                    return prevItem;
                  })
                )
              }
            />
          </li>
        ))}
      </ul>
      <p>Total: ${items.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
      <p>Balance: ${balance}</p>
      <button onClick={handleOrder}>Order</button>
    </div>
  );
};

export default Menu;
