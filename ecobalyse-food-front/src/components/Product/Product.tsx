const Product = () => {
    return (
        <form>
            <div className="mb-3">
                <label htmlFor="productName" className="product-form-label">Nom</label>
                <input type="text" className="form-control" id="productName" placeholder="ex: Nutella" />
            </div>
            <div className="mb-3">
                <label htmlFor="category" className="product-form-label">Category</label>
                <input type="text" className="form-control" id="category" placeholder="use shadcn select" />
            </div>
        </form>
    )
}

export default Product;