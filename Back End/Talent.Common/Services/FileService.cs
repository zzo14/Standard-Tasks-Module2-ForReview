using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            // Code by @Patrick Zou
            //Your code here;
            //throw new NotImplementedException();
            string bucketName = "talent-advanced-task";
            var objects = await _awsService.GetAllObjectFromS3(bucketName);
            if (objects.Any(o => o.Key == id))
            {
                return await _awsService.GetPresignedUrlObject(id, bucketName);
            }
            else
            {
                return "";
            }
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            // Code by @Patrick Zou
            //Your code here;
            //throw new NotImplementedException();
            if (string.IsNullOrWhiteSpace(_environment.WebRootPath))
            {
                _environment.WebRootPath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "wwwroot");
            }
            if (file == null || type != FileType.ProfilePhoto || string.IsNullOrEmpty(_environment.WebRootPath))
            {
                return "";
            }

            string bucketName = "talent-advanced-task";
            string uniqueFileName = $"{DateTime.Now.Ticks}_{file.FileName}";
            string pathValue = Path.Combine(_environment.WebRootPath, _tempFolder);
            string filePath = Path.Combine(pathValue, uniqueFileName);

            try
            {
                // Ensure the directory exists
                Directory.CreateDirectory(pathValue);
                // Save the file to the local directory
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                // Re-open the file for reading because the fileStream is closed after the using block
                using (var fileStreamForUpload = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    var success = await _awsService.PutFileToS3(uniqueFileName, fileStreamForUpload, bucketName);
                    if (!success)
                    {
                        // Optionally, log the failure or handle it according to your needs
                        return "";
                    }
                }
                // Optionally, delete the local file after successful upload
                // File.Delete(filePath);
                return uniqueFileName;
            }
            catch (Exception ex)
            {
                // Log the exception
                // For example: _logger.LogError(ex, "Failed to save file.");
                return "";
            }
        }


        public async Task<bool> DeleteFile(string id, FileType type)
        {
            // Code by @Patrick Zou
            //Your code here;
            //throw new NotImplementedException();
            string bucketName = "talent-advanced-task";
            return await _awsService.RemoveFileFromS3(id, bucketName);
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
