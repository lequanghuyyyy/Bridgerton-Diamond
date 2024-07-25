package org.example.diamondshopsystem.controllers;

import jakarta.mail.MessagingException;
import org.example.diamondshopsystem.dto.CategoryDTO;
import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.ContactRequest;
import org.example.diamondshopsystem.services.CategoryService;
import org.example.diamondshopsystem.services.ProductService;

import org.example.diamondshopsystem.services.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
@CrossOrigin(origins = "*")
public class HomeController {

    @Autowired
    ProductService productService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    RegistrationService registrationService;


    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "8") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productsPage = productService.getAllProduct(pageable);
        return ResponseEntity.ok(productsPage);
    }

    @GetMapping("/collection")
    public ResponseEntity<?> getProductByCollection(@RequestParam String collection, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.getProductByCollection(collection, pageable);
        if (!products.isEmpty()) {
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedProducts() {
        ResponseData responseData = new ResponseData();
        List<ProductDTO> featuredProducts = productService.getFeaturedProduct();
        responseData.setData(featuredProducts);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/getProductByCategory")
    public ResponseEntity<?> getProductByCategory(@RequestParam String categoryName, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productCate = productService.getProductByCategory(categoryName, pageable);
        return new ResponseEntity<>(productCate, HttpStatus.OK);
    }

    @GetMapping("/getProductByCategoryId")
    public ResponseEntity<?> getProductByCategoryId(@RequestParam int categoryId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productsByCategoryId = productService.getAllProductByCategory(categoryId, pageable);
        return new ResponseEntity<>(productsByCategoryId, HttpStatus.OK);
    }


    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/sortByPrice")
    public ResponseEntity<?> sortByPrice(@RequestParam String order, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> sortedProducts = productService.getProductStoredByPrice(order, pageable);
        if (!sortedProducts.isEmpty()) {
            return ResponseEntity.ok(sortedProducts);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //sort
    @GetMapping("/sort-by-name")
    public ResponseEntity<?> getProductsSortedByName(@RequestParam(defaultValue = "asc") String direction, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsSortedByName(direction, pageable));
    }

    @GetMapping("/sort-by-stock")
    public ResponseEntity<?> getProductsSortedByStockQuantity(@RequestParam(defaultValue = "asc") String direction, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsSortedByStockQuantity(direction, pageable));
    }

    @GetMapping("/search-by-name")
    public ResponseEntity<?> getProductsByNameKeyword(@RequestParam(defaultValue = "") String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsByNameKeyword(keyword, pageable));
    }

    @GetMapping("/by-price-range")
    public ResponseEntity<?> getProductsByPriceRange(@RequestParam double minPrice, @RequestParam double maxPrice, @RequestParam(defaultValue = "asc") String direction, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsByPriceRange(minPrice, maxPrice, direction, pageable));
    }

    @GetMapping("/by-category-sorted-by-price")
    public ResponseEntity<?> getProductsByCategorySortedByPrice(@RequestParam String categoryName, @RequestParam(defaultValue = "asc") String direction, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsByCategorySortedByPrice(categoryName, direction, pageable));
    }

    @GetMapping("/by-multiple-criteria")
    public ResponseEntity<?> getProductsByMultipleCriteria(@RequestParam(required = false) String categoryName, @RequestParam(required = false) String collection, @RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsByMultipleCriteria(categoryName, collection, minPrice, maxPrice, pageable));
    }

    @PostMapping("/contact")
    public ResponseEntity<?> contactUser(@RequestBody ContactRequest contactRequest) throws MessagingException {
        registrationService.sendContactToManager(contactRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
