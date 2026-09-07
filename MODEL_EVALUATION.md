# Model Evaluation

## Current evidence

No authentic flood or landslide model has been trained from the repository datasets. Therefore this project currently has no valid real-world accuracy, precision, recall, F1, ROC-AUC, PR-AUC, balanced accuracy, MAE, RMSE, or R-squared result to publish.

The existing ML service evaluates synthetic rule-generated labels with a sequential 80/20 split and reports only accuracy and F1. Those figures describe the demo classifier behavior, not real-world hazard performance, and must not be presented as operational validation.

## Required evaluation

For future classification models, report accuracy, precision, recall, F1, ROC-AUC/PR-AUC where appropriate, balanced accuracy, confusion matrix, and false-negative count/rate. For regression, report MAE, RMSE, and R-squared. For time series, use temporal validation and report MAE/RMSE.

Document dataset version, geographic and temporal holdout strategy, class balance, missing-value handling, threshold selection, and limitations for every run.
