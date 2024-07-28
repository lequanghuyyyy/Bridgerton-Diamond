import React, {useEffect, useState} from "react";
import ProductModel from "../../models/ProductModel";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import DiamondTable from "./DiamondAndShellTable/DiamondTable";
import ShellTable from "./DiamondAndShellTable/ShellTable";
import SizeModel from "../../models/SizeModel";
import Carousel from "react-multi-carousel";
import {SimilarItems} from "./component/SimilarItems";
import {Button, message, Modal} from "antd";

import ExpandInformation from "./component/ExpandInformation";

export const ProductCheckoutPage = () => {
    const [suggest, setSuggest] = useState<ProductModel[]>([]);
    const [product, setProduct] = useState<ProductModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<SizeModel>();
    const [sizeError, setSizeError] = useState<string | null>(null);
    const [outOfStock, setOutOfStock] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>();

    const showModal = (url: string | undefined) => {
        setImageUrl(url);
        setVisible(true);
        console.log(url);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`
    }

    const [size, setSize] = useState<SizeModel[]>([]);

    const productId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchProduct = async () => {
            window.scrollTo(0, 0)
            const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/product/${productId}`;
            const url: string = `${baseUrl}?page=0&size=10`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            console.log(baseUrl)
            const responseJson = await response.json();
            const loadedProduct: ProductModel = {
                productId: responseJson.productId,
                productName: responseJson.productName,
                price: responseJson.price,
                stockQuantity: responseJson.stockQuantity,
                collection: responseJson.collection,
                description: responseJson.description,
                image1: responseJson.image1,
                image2: responseJson.image2,
                image3: responseJson.image3,
                image4: responseJson.image4,
                categoryId: responseJson.categoryId,
                diamondId: responseJson.diamondId,
                shellId: responseJson.shellId,
                certificateImage: responseJson.certificateImage,
                warrantyImage: responseJson.warrantyImage,
            };

            const baseUrl2: string = "https://deploy-be-b176a8ceb318.herokuapp.com/home";
            const url2: string = `${baseUrl2}?page=0&size=10`;
            const response2 = await fetch(url2);
            if (!response2.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson2 = await response2.json();
            const responseData = responseJson2.content;
            const loadedProducts: ProductModel[] = [];
            for (const key in responseData) {
                loadedProducts.push({
                    productId: responseData[key].productId,
                    productName: responseData[key].productName,
                    price: responseData[key].price,
                    stockQuantity: responseData[key].stockQuantity,
                    collection: responseData[key].collection,
                    description: responseData[key].description,
                    image1: responseData[key].image1,
                    image2: responseData[key].image2,
                    image3: responseData[key].image3,
                    image4: responseData[key].image4,
                    categoryId: responseData[key].categoryId,
                    shellId: responseData[key].shellId,
                    certificateImage: responseData[key].certificateImage,
                    warrantyImage: responseData[key].warrantyImage,
                    diamondId: responseData[key].diamondId,
                });
            }

            setSuggest(loadedProducts);
            setIsLoading(false);
            setProduct(loadedProduct);
            setSelectedImage(responseJson.image1);
            setIsLoading(false);

            if (loadedProduct.stockQuantity === 0) {
                setOutOfStock(true)
            }

        };
        fetchProduct().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        });
    }, [productId]);


    useEffect(() => {
        fetchSize();
    }, [product]);

    const fetchSize = async () => {
        if (!product || !product.categoryId) return;
        const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/sizes/${product?.categoryId}`;
        const url: string = `${baseUrl}`;
        const response = await fetch(url, {headers: headers});
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const responseJson = await response.json();
        const loadedSize: SizeModel[] = [];

        for (const key in responseJson) {
            loadedSize.push({
                sizeId: responseJson[key].sizeId,
                valueSize: responseJson[key].valueSize,
                categoryId: responseJson[key].categoryId
            });
        }

        setSize(loadedSize);
        setIsLoading(false);
    };
    fetchSize().catch((error: any) => {
        setIsLoading(false);
        setHttpError(error.message);
        console.log(error);
    })

    const checkIfInCart = () => {
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
        const cart = JSON.parse(localStorage.getItem("cart")!);
        return cart.some((item: any) => item.productId === productId);
    };

    const addToCartHandler = async () => {
        if (checkIfInCart()) {
            message.warning('This product is already in your cart.');
            return;
        }
        if (!selectedSize) {
            setSizeError('Please select a size.');
            return;
        }
        if (localStorage.getItem("cart") === null) {
            localStorage.setItem("cart", JSON.stringify([]));
            let cart = JSON.parse(localStorage.getItem("cart")!);
            let product = {
                productId: productId,
                quantity: quantity,
                sizeId: selectedSize?.sizeId
            };
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            let cart = JSON.parse(localStorage.getItem("cart")!);
            let product = {
                productId: productId,
                quantity: quantity,
                sizeId: selectedSize?.sizeId
            };
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            const event = new CustomEvent('cartUpdated');
            window.dispatchEvent(event);
        }
        message.success('Added to cart successfully');
    };

    if (isLoading) {
        return <SpinnerLoading/>;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const handleThumbnailClick = (image: string) => {
        setSelectedImage(image);
    };

    const handleSizeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSizeId = Number(event.target.value);
        const selectedSize = size.find(s => s.sizeId === selectedSizeId);
        if (selectedSize) {
            setSelectedSize(selectedSize)
        }
        console.log(selectedSize)
    };


    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 3000},
            items: 5
        },
        desktop: {
            breakpoint: {max: 3000, min: 1024},
            items: 4
        },
        tablet: {
            breakpoint: {max: 1024, min: 464},
            items: 2
        },
        mobile: {
            breakpoint: {max: 464, min: 0},
            items: 1
        }
    }

    return (
        <div style={{ marginTop: '200px', marginBottom: '80px'}} className="container">
            <div className="container d-none d-lg-block w-1000">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-6 text-center">
                        <img
                            src={selectedImage}
                            style={{
                                width: '455px',
                                height: '390px',
                                border: '1px solid black',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            alt="product"
                        />
                        <div className="d-flex justify-content-center mt-3">
                            {product?.image1 && (
                                <>
                                    {[product.image1, product.image2, product.image3, product.image4].map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            style={{
                                                width: '106px',
                                                height: '100px',
                                                margin: '5px',
                                                cursor: 'pointer',
                                                border: '1px solid black',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            }}
                                            alt="thumbnail"
                                            onClick={() => handleThumbnailClick(image)}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6 col-4 container">
                        <div className="ml-2">
                            <h2 style={{fontSize: '40px', paddingLeft: '0', fontWeight: 'bold'}}>
                                {product?.productName}
                            </h2>
                            <p style={{fontWeight: 'bolder', fontSize: '20px', color: 'red'}}>
                                Price: ${product?.price}
                            </p>
                            <p>{product?.description}</p>
                            <div style={{display: 'flex'}}>
                                <Button
                                    onClick={() => showModal(product?.certificateImage)}
                                    style={{marginRight: '10px'}}
                                >
                                    <img style={{width: 50}}
                                         src={'https://www.gia.edu/assets/img/global-header/desktop/gia-logo.svg'}
                                         alt="certificate"/>
                                </Button>
                                <Button
                                    onClick={() => showModal('https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fz5624916933804_dcdb067c2dd16407a4cf0a91cecce6f6.jpg?alt=media&token=7007668e-e495-4692-93d8-d698a6ac01ab')}
                                    style={{
                                        cursor: 'pointer',
                                        color: 'black',
                                        textDecoration: 'underline',
                                        marginBottom: '10px',
                                        display: 'block',
                                    }}
                                >
                                    Size Guide
                                </Button>
                            </div>
                            <ExpandInformation title='More Information' content= {
                                <>
                                <DiamondTable product={product}/>
                                <ShellTable product={product}/>
                                </>
                            }/>

                            <select
                                style={{
                                    width: '200px',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    marginTop: '10px',
                                    borderRadius: '4px',
                                    padding: '8px',
                                }}
                                className="form-select"
                                aria-label="Default select example"
                                onChange={handleSizeSelect}
                            >
                                <option selected>Choose size...</option>
                                {size.map((s) => (
                                    <option key={s.sizeId} value={s.sizeId}>
                                        {s.valueSize}
                                    </option>
                                ))}
                            </select>
                            {sizeError && <p style={{color: 'red'}}>{sizeError}</p>}

                            {outOfStock ? (
                                <h1
                                    style={{
                                        borderRadius: '4px',
                                        backgroundColor: 'red',
                                        textAlign: 'center',
                                        color: 'white',
                                        padding: '5px',
                                        marginTop: '15px',
                                    }}
                                >
                                    OUT OF STOCK
                                </h1>
                            ) : (
                                <button
                                    style={{
                                        borderRadius: '4px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        padding: '10px',
                                        marginTop: '10px',
                                        width: '100%',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={addToCartHandler}
                                >
                                    ADD TO CART
                                </button>
                            )}
                            <Modal
                                visible={visible}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                width={800}
                            >
                                <img src={imageUrl} alt="Example" style={{ width: '100%' }} />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5" style={{ height: 550 }}>
                <div className="homepage-carousel-title">
                    <h1 style={{ fontSize: '45px', marginBottom: '0' }} className="custom-heading">
                        Similar Items
                    </h1>
                </div>
                <Carousel responsive={responsive} className="mt-5">
                    {suggest.slice(0, 4).map((prod) => (
                        <SimilarItems key={prod.productId} product={prod} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
};
