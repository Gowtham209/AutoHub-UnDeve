package com.AutoHub.autohub_backend.Services;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.AutoHub.autohub_backend.CustomExceptions.CarModelException;
import com.AutoHub.autohub_backend.CustomExceptions.UserException;
import com.AutoHub.autohub_backend.Entities.CarModels;
import com.AutoHub.autohub_backend.Entities.UserAddresses;
import com.AutoHub.autohub_backend.Entities.Users;
import com.AutoHub.autohub_backend.Repositories.CarModelsRepo;
import com.AutoHub.autohub_backend.Repositories.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class UsersService {

	private static final Logger logger =LoggerFactory.getLogger(UsersService.class);
	@Autowired
	public UsersRepository userRepo;
	private BCryptPasswordEncoder encoder= new BCryptPasswordEncoder(12);
	@Autowired
	public CarModelsRepo cmr;
	
	public Users addNewUser(Users userObj) throws UserException
	{
		Users responseObj=null;
		List<Users> dbLst=userRepo.findAll();
		if(dbLst.size()==0)
		{
			userObj.setUserRole(1);
			logger.info("Admin Creation");
		}
		else 
		{
			userObj.setUserRole(2);
			logger.info("Customer Created");
		}
            userObj.setIsVisible(true);
		try
		{
			 userObj.setPassword(encoder.encode(userObj.getPassword()));
			 responseObj=userRepo.save(userObj);
		}
		catch (Exception e) {
			throw new UserException("Error User Unable to SAVE "+e.getMessage()+" \n ExceptionName:"+e);
		}
		return responseObj;
	}

	public List<Users> getUserList() {
		logger.info("Retrieving All Users");
		return userRepo.findAll();
	}

	public Users getUser(Long userId) throws UserException{

		logger.info("Fetching Single user:"+userId);
		Users userRespo=userRepo.findById(userId).orElse(null);
		if(userRespo==null)
		{
			logger.info("Error:Fetching Single user:"+userId);
			throw new UserException("Error No User FOUND");
		}
		return userRespo;
	}

	public void deleteByUserId(Long userId) throws UserException{
		try {
			logger.info("Deleting Single user:"+userId);
			Users dbObj=userRepo.findById(userId).orElseThrow(()->new UserException("No User Found"));
			dbObj.setIsVisible(false);
			userRepo.save(dbObj);
		} catch (Exception e) {

			logger.info("Error:Deleting Single user:"+userId);
			throw new UserException("Error Can't able to Delete User");
		}
	}

	public Users updateUser(Long userId, Users userObj) throws UserException{
		logger.info("Updating Single user:"+userId);
		Users userDBObj=userRepo.findById(userId).orElse(null);
		if(userDBObj==null)
		{
			logger.info("Error:Updating Single user:"+userId);
			throw new UserException("Error No User FOUND");
		}
		Method[] methods=userDBObj.getClass().getDeclaredMethods();
		/**/
		 Class<?> clazz = userDBObj.getClass();
		for(Method mtd:methods)
		{
			Object value=null;
		    try
		    {	
		    	String methodName=mtd.getName();
		    	if(methodName.startsWith("get") && !methodName.contains("FavoriteCars") && !methodName.contains("CarPurchased") && !methodName.contains("TestDriveBookings"))
			    {
		    		value=mtd.invoke(userObj);
		    		
		    		if(value!=null)
		    		{
		    			String setter=methodName.replace("get", "set");
		    			/**/
		    			 Method setterMethod = clazz.getMethod(setter, value.getClass());
		    			 // The Above Line used to Retrive EXACT method that has the Expected VALUE Parameter
		    	         setterMethod.invoke(userDBObj, value);
			       }
			    }
		    }
		    catch (Exception e) {
		    	throw new UserException(e.getMessage());
			}
		}
		//userDBObj.setPassword(encoder.encode(userDBObj.getPassword()));
		Users reponseuserObj=userRepo.save(userDBObj);
		return reponseuserObj;
	}
}
