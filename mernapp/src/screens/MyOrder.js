import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/myOrderData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("userEmail"),
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setOrderData(data.orderData || []); // Set an empty array if orderData is not present
    } catch (error) {
      console.error("Error fetching my order:", error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          {Array.isArray(orderData) && orderData.length > 0 ? (
            orderData.map((order, index) => (
              <div key={index}>
                {order.Order_date ? (
                  <div className="m-auto mt-5">
                    {order.Order_date}
                    <hr />
                  </div>
                ) : (
                  <div className="col-12 col-md-6 col-lg-3">
                    <div
                      className="card mt-3"
                      style={{ width: "16rem", maxHeight: "360px" }}
                    >
                      <img
                        src={order.img}
                        className="card-img-top"
                        alt="..."
                        style={{ height: "120px", objectFit: "fill" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{order.name}</h5>
                        <div
                          className="container w-100 p-0"
                          style={{ height: "38px" }}
                        >
                          <span className="m-1">{order.qty}</span>
                          <span className="m-1">{order.size}</span>
                          <span className="m-1">{order.Order_date}</span>
                          <div className="d-inline ms-2 h-100 w-20 fs-5">
                            ₹{order.price}/-
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
