import React, {useContext} from 'react';
import {Context} from "../index";

const Basket = () => {

    const {store} = useContext(Context);

    async function basket() {
        await store.openBasket();
    }
    basket();

    return (
        <div>
            Basket
        </div>
    );
};

export default Basket;