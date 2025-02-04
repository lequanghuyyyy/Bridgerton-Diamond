package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.dto.SizeDTO;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.payload.requests.ConfirmOrderRequest;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.services.Map.OrderMapper;
import org.example.diamondshopsystem.services.ShoppingCartService;
import org.example.diamondshopsystem.services.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sale")
@CrossOrigin(origins = "*")
public class SaleController {

    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderServiceImp orderServiceImp;
    @Autowired
    private OrderMapper orderMapper;

    @GetMapping("/ViewOrderPaymentAndPending")
    public ResponseEntity<List<OrderDTO>> getOrderByPaymentAndPending(@RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        try {
            List<OrderStatus> statuses = Arrays.asList(OrderStatus.PAYMENT, OrderStatus.PENDING, OrderStatus.DELIVERED);
            Page<OrderDTO> newOrdersPage = orderServiceImp.getAllOrdersByStatuses(statuses, PageRequest.of(page, size));
            List<OrderDTO> newOrders = newOrdersPage.getContent();
            return ResponseEntity.ok(newOrders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/setOrderToDelivery/{orderId}")
    public ResponseEntity<?> setOrderToDelivery(@PathVariable Integer orderId) {
        try {
            orderServiceImp.setOrderFromPaymentToDelivery(orderId);
            return ResponseEntity.ok("Set successfully from payment to delivery");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
