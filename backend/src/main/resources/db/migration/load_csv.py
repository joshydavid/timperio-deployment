import os
import pandas as pd
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    Enum,
    Float,
    TIMESTAMP,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from dotenv import load_dotenv
import enum

load_dotenv()

PYTHON_DB_URL = os.getenv("PYTHON_DB_URL")

Base = declarative_base()


class SalesType(enum.Enum):
    CONSIGNMENT = "CONSIGNMENT"
    DIRECT_B2B = "DIRECT_B2B"
    DIRECT_B2C = "DIRECT_B2C"
    MARKETING = "MARKETING"
    WHOLESALER = "WHOLESALER"


class ChannelType(enum.Enum):
    ONLINE_WEBSITE = "ONLINE_WEBSITE"
    SHOPEE = "SHOPEE"
    OFFLINE = "OFFLINE"


class ShippingMethod(enum.Enum):
    STANDARD_DELIVERY = "STANDARD_DELIVERY"
    SAME_DAY_DELIVERY = "SAME_DAY_DELIVERY"
    SELF_COLLECT = "SELF_COLLECT"


class SalesPurchase(Base):
    __tablename__ = "purchase_history"

    sales_id = Column(Integer, primary_key=True)
    sales_date = Column(Date, nullable=False)
    sales_type = Column(Enum(SalesType), nullable=True)
    channel_type = Column(Enum(ChannelType), nullable=True)
    customer_id = Column(Integer, nullable=False)
    zip_code = Column(Integer, nullable=True)
    shipping_method = Column(Enum(ShippingMethod), nullable=False)
    product = Column(String(100), nullable=False)
    variant = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


engine = create_engine(PYTHON_DB_URL)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


def import_data(file_path):
    """Import employee data from a CSV file into the PostgreSQL database."""
    file_path = os.path.abspath(file_path)
    df = pd.read_excel(file_path, sheet_name="Sales by product")

    session = Session()

    for _, row in df.iterrows():
        sales_type = row["Sale Type"]
        channel_type = row["Digital"]
        shipping_method = row["Shipping Method"]
        zip_code = row["ZipCode"]

        # Map sales types and channel types
        if sales_type == "Direct - B2B":
            sales_type = "DIRECT_B2B"

        if sales_type == "Direct - B2C":
            sales_type = "DIRECT_B2C"

        if channel_type == "Online - Website":
            channel_type = "ONLINE_WEBSITE"

        if shipping_method == "Standard Delivery":
            shipping_method = "STANDARD_DELIVERY"

        if shipping_method == "Same Day Delivery":
            shipping_method = "SAME_DAY_DELIVERY"

        if shipping_method == "Self Collect":
            shipping_method = "SELF_COLLECT"

        sales_type = sales_type.upper() if pd.notnull(sales_type) else None
        channel_type = channel_type.upper() if pd.notnull(channel_type) else None
        shipping_method = (
            shipping_method.upper() if pd.notnull(shipping_method) else shipping_method
        )
        zip_code = zip_code if pd.notnull(zip_code) else None

        sales_purchase = SalesPurchase(
            sales_id=row["Row No."],
            sales_date=row["Sale Date"],
            sales_type=sales_type,
            channel_type=channel_type,
            customer_id=row["Customer ID"],
            zip_code=zip_code,
            shipping_method=shipping_method,
            product=row["Product"],
            variant=row["Variant"],
            quantity=row["Quantity"],
            unit_price=row["Price"],
            total_price=row["Product Price"],
        )

        try:
            session.add(sales_purchase)
            session.commit()
        except Exception as e:
            session.rollback()
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    import_data("./sales_data.xlsx")
