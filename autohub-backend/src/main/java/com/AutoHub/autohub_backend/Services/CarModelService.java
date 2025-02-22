package com.AutoHub.autohub_backend.Services;
import java.lang.reflect.Method;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AutoHub.autohub_backend.CustomExceptions.CarModelException;
import com.AutoHub.autohub_backend.Entities.CarModels;
import com.AutoHub.autohub_backend.Entities.Category;
import com.AutoHub.autohub_backend.Repositories.CarModelsRepo;
import com.AutoHub.autohub_backend.Repositories.CategoryRepo;

@Service
public class CarModelService {
	
	@Autowired
	public CarModelsRepo carModelRepoObj;
	@Autowired
	private CategoryRepo categoryRepoObj;

	public CarModels addCarModel(CarModels carModelObj) throws CarModelException{
		
		Category payLoad=carModelObj.getCategory();
		
		if(payLoad==null)
			throw new CarModelException("Error Category Not Specified");
		
		Category categoryDBObj=carModelObj.getCategory();
		if(payLoad.getCarType()==null)
		{
			categoryDBObj=categoryRepoObj.findById(payLoad.getCategoryId()).orElse(null);
			
			if(categoryDBObj==null)
				throw new CarModelException("Error Category Not Present in SERVER");

		}
		else 
		{		
		categoryDBObj = categoryRepoObj.findById(carModelObj.getCategory().getCategoryId()).orElse(null);
		if(categoryDBObj==null)
		{
			Category newCate=new Category();
			newCate.setCarType(carModelObj.getCategory().getCarType());
			categoryDBObj=newCate;
		}
		}
		carModelObj.setCategory(categoryDBObj);
		CarModels reponseObj=carModelRepoObj.save(carModelObj);
		
		if(reponseObj==null)
			throw new CarModelException("Error Unable to Update");
		
		return reponseObj;
	}

	public Integer addCarModelList(List<CarModels> carList) throws CarModelException{
		Integer respCount = null;
		try {
			 respCount = carModelRepoObj.saveAll(carList).size();
		} catch (Exception e) {
			throw new CarModelException("Error Unable to Add BATCH CarModel");
		}
		return respCount;
	}

	public CarModels getCarModel(Long carId) throws CarModelException
	{
		CarModels reponseObj=carModelRepoObj.findById(carId).orElse(null);
		
		if(reponseObj==null)
			throw new CarModelException("Error No Car Model is Found");
		
		return reponseObj;
	}

	public List<CarModels> getAllCarModel() {
		List<CarModels> reponseObjList=carModelRepoObj.findAll();
		return reponseObjList;
	}

	public void deleteByCarModelId(Long carId) throws CarModelException
	{

		CarModels carModelDBObj = carModelRepoObj.findById(carId)
			    .orElseThrow(() -> new CarModelException("Car model with ID " + carId + " not found."));
      
		if(carModelDBObj.getCarLots()>0)
		{
			throw new CarModelException("Error Can't Delete CarModel Because Few Cars are UnSOLD");
		}
		try {
			carModelDBObj.setIsVisible(false);
			carModelRepoObj.save(carModelDBObj);
		} catch (Exception e) {
			throw new CarModelException("Error Can't able to Delete CarModel");
		}	
	}

	public CarModels updateCarModel(CarModels carModelObj, Long carId) throws CarModelException {
		CarModels carModelObjDB = carModelRepoObj.findById(carId).orElse(null);

		if (carModelObjDB == null) {
			throw new CarModelException("Error No CarModel is Present in SERVER");
		}

		if (carModelObj.getCategory() != null) {
			Category managedCategory = categoryRepoObj.findById(carModelObj.getCategory().getCategoryId()).orElseThrow(()-> new CarModelException("Error No Category is Present in SERVER"));
			carModelObjDB.setCategory(managedCategory);
		}
		if (carModelObj.getAvailable() != null) {
			carModelObjDB.setAvailable(carModelObj.getAvailable());
		}
		if (carModelObj.getYear() != null) {
			carModelObjDB.setYear(carModelObj.getYear());
		}
		if (carModelObj.getPrice() != null) {
			carModelObjDB.setPrice(carModelObj.getPrice());
		}
		if (carModelObj.getModelName() != null) {
			carModelObjDB.setModelName(carModelObj.getModelName());
		}
		if (carModelObj.getCarLots() != null) {
			carModelObjDB.setCarLots(carModelObj.getCarLots());
		}
		if (carModelObj.getIsVisible() != null) {
			carModelObjDB.setIsVisible(carModelObj.getIsVisible());
		}

		CarModels responseCarModelObj = carModelRepoObj.save(carModelObjDB);

		return responseCarModelObj;
	}


}
