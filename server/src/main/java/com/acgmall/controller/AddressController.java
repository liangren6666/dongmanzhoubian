package com.acgmall.controller;

import com.acgmall.common.Result;
import com.acgmall.entity.Address;
import com.acgmall.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private HttpServletRequest request;

    private Integer getCurrentUserId() {
        return (Integer) request.getAttribute("userId");
    }

    @GetMapping("/list")
    public Result<?> list() {
        try {
            Integer userId = getCurrentUserId();
            return addressService.list(userId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Address address) {
        try {
            Integer userId = getCurrentUserId();
            return addressService.add(userId, address);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Address address) {
        try {
            Integer userId = getCurrentUserId();
            return addressService.update(userId, address);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> delete(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return addressService.delete(id, userId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/set-default/{id}")
    public Result<?> setDefault(@PathVariable Integer id) {
        try {
            Integer userId = getCurrentUserId();
            return addressService.setDefault(id, userId);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
