CREATE TABLE "Order" (
    "orderId"      TEXT          PRIMARY KEY,
    "value"        NUMERIC(10,2) NOT NULL,
    "creationDate" TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE "Items" (
    "orderId"   TEXT           NOT NULL,
    "productId" INT            NOT NULL,
    "quantity"  INT            NOT NULL,
    "price"     NUMERIC(10,2)  NOT NULL,

    PRIMARY KEY ("orderId", "productId"),
    CONSTRAINT fk_order FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE
);