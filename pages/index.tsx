import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [orderItemId, setOrderItemId] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(0);

  const translations = {
    en: {
      title: "Beverage Consumption Tracker",
      inventory: "Inventory",
      add: "Add",
      placeholder: "New item name",
      quantity: "Quantity",
      order: "Order",
      orderPlaceholder: "Quantity to order",
    },
    nl: {
      title: "Drankenverbruik Tracker",
      inventory: "Voorraad",
      add: "Toevoegen",
      placeholder: "Nieuwe item naam",
      quantity: "Aantal",
      order: "Bestellen",
      orderPlaceholder: "Aantal bestellen",
    },
    es: {
      title: "Seguimiento de Consumo de Bebidas",
      inventory: "Inventario",
      add: "Agregar",
      placeholder: "Nombre del nuevo ítem",
      quantity: "Cantidad",
      order: "Pedir",
      orderPlaceholder: "Cantidad a pedir",
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("inventory").select("*");
    if (!error) setInventory(data);
    setLoading(false);
  };

  const addItem = async () => {
  if (!newItem) return;

  // Check if product_name already exists
  const { data: existingItems, error: checkError } = await supabase
    .from("inventory")
    .select("id")
    .eq("product_name", newItem)
    .limit(1);

  if (checkError) {
    console.error("Error checking duplicates:", checkError);
    return;
  }

  if (existingItems && existingItems.length > 0) {
    alert("Item already exists!");
    return;
  }

  // Insert new item
  const { error } = await supabase
    .from("inventory")
    .insert({ product_name: newItem, quantity: 0 });

  if (!error) {
    setNewItem("");
    fetchInventory();
  }
};


  const orderItem = async () => {
    if (!orderItemId || orderQuantity <= 0) return;
    const item = inventory.find((i) => i.id === parseInt(orderItemId));
    if (!item) return;

    const { error } = await supabase
      .from("inventory")
      .update({ quantity: item.quantity + orderQuantity })
      .eq("id", item.id);

    if (!error) {
      setOrderItemId("");
      setOrderQuantity(0);
      fetchInventory();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded p-1"
          >
            <option value="en">English</option>
            <option value="nl">Nederlands</option>
            <option value="es">Español</option>
          </select>
        </header>

        <section className="bg-white p-4 rounded-2xl shadow space-y-4">
          <h2 className="text-xl font-semibold">{t.inventory}</h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <ul className="space-y-2">
              {inventory.map((item) => (
                <li key={item.id} className="p-2 border rounded flex justify-between items-center">
                  <span>{item.product_name} — {t.quantity}: {item.quantity}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex space-x-2 mt-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={t.placeholder}
              className="border p-2 flex-grow rounded"
            />
            <Button onClick={addItem}>{t.add}</Button>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">{t.order}</h3>
            <select
              value={orderItemId}
              onChange={(e) => setOrderItemId(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">-- Select Item --</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product_name}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                placeholder={t.orderPlaceholder}
                className="border p-2 flex-grow rounded"
              />
              <Button onClick={orderItem}>{t.order}</Button>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
