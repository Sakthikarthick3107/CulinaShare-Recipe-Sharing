from django.db.models import Avg,Count ,F
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category , Recipe , Ingredient , Rating
from .serializers import CategorySerializer , RecipeSerializer , IngredientSerializer , RatingSerializer
import json


class CategoryView(APIView):
    def get(self,request):
        
        response = Category.objects.all()
        serializer = CategorySerializer(response , many=True)
        return Response(serializer.data)
    
class RecipeView(APIView):
    def get(self,request,recipe_id=None,categories = None , is_vegetarian=None , author=None):
        if recipe_id is not None:
            recipes = Recipe.objects.annotate(
                        average_score = Avg('Rating__score') or 0,
                        number_of_ratings = Count('Rating')
                        ).order_by('-recipe_id').get(recipe_id=recipe_id)
            if recipes.average_score is not None:
                recipes.average_score = round(recipes.average_score, 1)
            serializer = RecipeSerializer(recipes)
            return Response(serializer.data)
        
        elif author is not None:
            recipes = Recipe.objects.annotate(
                        average_score = Avg('Rating__score') or 0,
                        number_of_ratings = Count('Rating'),
                        ).order_by('-recipe_id').filter(author = author)
            for recipe in recipes:
                recipe.average_score = round(recipe.average_score, 1) if recipe.average_score else None
            
            
            serializer = RecipeSerializer(recipes , many=True)
            return Response( serializer.data)
        
        elif categories is not None and is_vegetarian is not None:
            recipes = Recipe.objects.annotate(
                        average_score = Avg('Rating__score') or 0,
                        number_of_ratings = Count('Rating')
                        ).order_by('-average_score').filter(categories = categories , is_vegetarian = is_vegetarian)
            for recipe in recipes:
                recipe.average_score = round(recipe.average_score, 1) if recipe.average_score else None
            serializer = RecipeSerializer(recipes , many=True)
            return Response(serializer.data)
        
        elif categories is not None:
            
            recipes = Recipe.objects.annotate(
                        average_score = Avg('Rating__score') or 0,
                        number_of_ratings = Count('Rating')
                        ).order_by('-average_score').filter(categories = categories).order_by('-average_score')
            for recipe in recipes:
                recipe.average_score = round(recipe.average_score, 1) if recipe.average_score else None
            serializer = RecipeSerializer(recipes , many=True)
            return Response(serializer.data)
        
        elif is_vegetarian is not None:
            recipes = Recipe.objects.annotate(
                        average_score = Avg('Rating__score') or 0,
                        number_of_ratings = Count('Rating')
                        ).order_by('-recipe_id').filter(is_vegetarian=is_vegetarian).order_by('-average_score')
            for recipe in recipes:
                recipe.average_score = round(recipe.average_score, 1) if recipe.average_score else None
            serializer = RecipeSerializer(recipes , many=True)
            return Response(serializer.data)
        
        recipes = Recipe.objects.annotate(
            average_score = Avg('Rating__score') or 0,
            number_of_ratings = Count('Rating')).order_by('-average_score' , '-recipe_id')
        for recipe in recipes:
            recipe.average_score = round(recipe.average_score, 1) if recipe.average_score else None
            
            
        serializer = RecipeSerializer(recipes , many=True)
        return Response(serializer.data)
        # response = Recipe.objects.all().order_by('-recipe_id')
        # serializer = RecipeSerializer(response , many=True)
        # return Response(serializer.data)
    def post(self,request):
        recipe = RecipeSerializer(data=request.data)
        if recipe.is_valid():
            recipe.save()
            return Response({'message' : 'Success',
                             'data': recipe.data})
        return Response(recipe.errors)

class IngredientView(APIView):
    def get(self,request,recipe=None):
        if recipe is not None:
            response = Ingredient.objects.filter(recipe=recipe)
            serializer = IngredientSerializer(response , many=True)
            return Response(serializer.data)
        response = Ingredient.objects.all()
        serializer = IngredientSerializer(response , many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        ingredients_data = request.data
        errors = []
        for ingredient_data in ingredients_data:
            
            serializer = IngredientSerializer(data=ingredient_data)
            if serializer.is_valid():
                serializer.save()
            else:
                errors.append(serializer.errors)
        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Recipe posted successfully"}, status=status.HTTP_201_CREATED)


class RatingView(APIView):
    def get(self,request,recipe=None):
        if recipe is not None:
            ratings = Rating.objects.annotate(username=F('user__username')).filter(recipe=recipe).order_by('-id')
             # Calculate average score and count
            
            ratings_aggregate = ratings.aggregate(Avg('score'), Count('id'))
            serializer = RatingSerializer(ratings , many=True)
            return Response({
                'data':serializer.data,
                '-average_score' : ratings_aggregate['score__avg'] or 0,
                'no_of_ratings' : ratings_aggregate['id__count']
                },status=status.HTTP_200_OK)
        response = Rating.objects.annotate(username=F('user__username')).all()
        serializer = RatingSerializer(response , many=True)
        return Response(serializer.data)
    def post(self,request):
        ratingsData = RatingSerializer(data=request.data)
        if ratingsData.is_valid():
            ratingsData.save()
            return Response({'message' : 'Your feedback is posted'} , status=status.HTTP_201_CREATED)
        return Response({'error' : 'Error while posting comment'})
    
