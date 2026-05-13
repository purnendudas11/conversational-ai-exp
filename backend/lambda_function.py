import boto3
import json
import os

bedrock = boto3.client("bedrock-agent-runtime", region_name="us-east-1")

KNOWLEDGE_BASE_ID = "AEWOQUNVGC"

def load_prompt_template(filename):
    """Load prompt template from file"""
    try:
        # Get the directory where the Lambda function is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, 'prompts', filename)
        
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        raise Exception(f"Prompt template file not found: {filename}")
    except Exception as e:
        raise Exception(f"Error loading prompt template: {str(e)}")


def lambda_handler(event, context):
    # For AWS integration (non-proxy) - body is the event itself
    if isinstance(event, dict) and 'body' not in event:
        body = event
        # For AWS_PROXY integration - body is in event["body"]
    elif 'body' in event:
            body = json.loads(event["body"]) if isinstance(event["body"], str) else event["body"]
    else:
            body = event
            
    # Load prompt templates
    generation_prompt = load_prompt_template('prompt.txt')

        # Your function logic here
    print(f"Received body: {body}")
    user_query = body["message"]

    
    response = bedrock.retrieve_and_generate(
    input={"text": user_query},
    retrieveAndGenerateConfiguration={
        "type": "KNOWLEDGE_BASE",
        "knowledgeBaseConfiguration": {
            "knowledgeBaseId": KNOWLEDGE_BASE_ID,
            "modelArn": "arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-pro-v1:0",
            # "modelArn": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-opus-20240229:0",
            "retrievalConfiguration": {
                "vectorSearchConfiguration": {
                    "numberOfResults": 3,
                    'overrideSearchType': 'SEMANTIC'
                }
            },
            "generationConfiguration": {
                # if less options are needed uncomment below code
                "inferenceConfig": {
                    "textInferenceConfig": {
                        "temperature": 0.2
                        # "maxTokens": 2000
                    }
                },
                "promptTemplate": {
                    "textPromptTemplate": generation_prompt
                    },
                    "guardrailConfiguration": {
                        "guardrailId": "c67hdsn3nqys",
                        "guardrailVersion": "DRAFT"
                    }
                }
            }
        }
    )


    answer = response["output"]["text"]

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"response": answer})
    }