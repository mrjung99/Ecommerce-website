import React from "react";

const EsewaPayment = () => {
  return (
    <div>
      <form
        className="flex flex-col space-y-2 my-6 mx-5"
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="">Amount: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="amount"
            name="amount"
            defaultValue={100}
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Tax amount: </label>
          <input
            className="border border-gray-600 px-2 "
            type="text"
            id="tax_amount"
            name="tax_amount"
            defaultValue={10}
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Total amount: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="total_amount"
            name="total_amount"
            defaultValue={110}
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Transaction id: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="transaction_uuid"
            name="transaction_uuid"
            defaultValue={241028}
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Product code: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="product_code"
            name="product_code"
            defaultValue="EPAYTEST"
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Product service charge: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="product_service_charge"
            name="product_service_charge"
            defaultValue={0}
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Delivery charge: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="product_delivery_charge"
            name="product_delivery_charge"
            defaultValue={0}
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Success url: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="success_url"
            name="success_url"
            defaultValue="https://developer.esewa.com.np/success"
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Failure url: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="failure_url"
            name="failure_url"
            defaultValue="https://developer.esewa.com.np/failure"
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Signed field names: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="signed_field_names"
            name="signed_field_names"
            defaultValue="total_amount,transaction_uuid,product_code"
            required=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="">Signature: </label>
          <input
            className="border border-gray-600 px-2"
            type="text"
            id="signature"
            name="signature"
            defaultValue="i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME="
            required=""
          />
        </div>
        <input
          className="bg-green-500 p-1 my-5 hover:bg-green-600 text-white cursor-pointer"
          defaultValue="Submit"
          type="submit"
        />
      </form>
    </div>
  );
};

export default EsewaPayment;
